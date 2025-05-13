// This is a small proxy server that will be used to forward requests to the backend
// Created By DTM

const http = require("node:http");

const PORT = 3000;
const BACKEND_URL = "http://localhost:3001";

const RATE_LIMIT = {
  windowMs: 60 * 1000,
  maxRequests: 500,
};

const ALLOWED_USER_AGENTS = [
  "MercadoPago Feed v2.0 merchant_order",
  "MercadoPago Feed v2.0 payment",
  "MercadoPago WebHook v1.0 payment",
  "Dart/3.7",
];

const ALLOWED_IPS = ["18.215.140.160", "54.88.218.97", "18.206.34.84", "18.213.114.129"];

const ALLOWED_ORIGINS = [];

const requestCounts = new Map();

const server = http.createServer((req, res) => {
  console.log(`Recibida solicitud a: ${req.url}`);

  const userAgent = req.headers["user-agent"] || "";
  const isAllowedUserAgent = ALLOWED_USER_AGENTS.some((allowedAgent) => userAgent.includes(allowedAgent));

  const origin = req.headers.origin;
  const isAllowedOrigin = origin && ALLOWED_ORIGINS.includes(origin);

  const clientIp = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();

  const isAllowedIp = ALLOWED_IPS.includes(clientIp);

  if (!(isAllowedUserAgent || isAllowedIp || isAllowedOrigin)) {
    console.log(
      `Solicitud rechazada - IP: ${
        req.headers["x-forwarded-for"] || req.socket.remoteAddress
      }, User-Agent: ${userAgent}, Origen: ${origin}`,
    );
    res.writeHead(403, { "Content-Type": "text/plain" });
    return res.end("Acceso denegado: Proxy Code 001");
  }

  const now = Date.now();

  if (!requestCounts.has(clientIp)) {
    requestCounts.set(clientIp, { count: 0, lastReset: now });
  }

  const clientData = requestCounts.get(clientIp);

  if (now - clientData.lastReset > RATE_LIMIT.windowMs) {
    clientData.count = 0;
    clientData.lastReset = now;
  }

  clientData.count += 1;

  if (clientData.count > RATE_LIMIT.maxRequests) {
    res.writeHead(429, { "Content-Type": "text/plain" });
    return res.end("Inténtalo más tarde proxy code: 002");
  }

  const options = {
    hostname: new URL(BACKEND_URL).hostname,
    port: new URL(BACKEND_URL).port || 80,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on("error", (err) => {
    console.error("Error al conectar con el backend:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Error interno del servidor");
  });

  req.pipe(proxyReq, { end: true });
});

server.listen(PORT, () => {
  console.log(`Proxy escuchando en :${PORT}`);
});
