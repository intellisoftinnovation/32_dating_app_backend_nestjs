# Chomy Backend

## Setting Up the Project

1. **Clone the Project**  
   Clone the repository to your local machine using the following command:
   ```bash
   git clone git@github.com:intellisoftinnovation/32_dating_app_backend_nestjs.git

    Install Dependencies
    Navigate to the project directory and install the required dependencies:

cd 32_dating_app_backend_nestjs
npm install

Configure Environment Variables
Copy the .env.template file to .env and update the necessary environment variables:

cp .env.template .env

Open the .env file and fill in the required environment variables, such as database credentials, API keys, etc. If you don't have a MongoDB database set up, you can proceed to the next step.

Run MongoDB with Docker Compose (Optional)
If you don't have MongoDB installed, you can set it up using Docker Compose. Make sure Docker is installed on your machine and run the following command:

docker-compose up -d

This will start a MongoDB container ready to use. Ensure the environment variables in .env point to this MongoDB instance.

Run the Project
Start the development server using the following command:

npm run start:dev

Access the Documentation
Once the server is running, you can access the API documentation by navigating to:

    http://localhost:3000/api/0.0.1/docs

    Replace localhost:3000 with your server's URL if it's hosted elsewhere.

Project Structure

    src/: Contains the source code of the application.

    .env: Environment variables configuration.

    .env.template: Template for environment variables.

    package.json: Lists project dependencies and scripts.

Additional Information

    Ensure you have Node.js and npm installed on your machine.

    For production deployment, consider using npm run build and npm run start.

    If you use Docker Compose to run MongoDB, ensure the service is properly configured in the docker-compose.yml file.

🔐 Configuración del Proxy en el VPS

Una vez desplegado el backend en el VPS, es importante configurar y habilitar el proxy correctamente para permitir el acceso del dashboard y gestionar las peticiones externas de forma segura.
1. Acceso al archivo del proxy y reinicio

Dentro del VPS, se deben ejecutar los siguientes comandos para acceder al código del proxy y reiniciarlo si se hacen cambios:

cd 32_dating_app_backend_nestjs/src
nano proxy.js
# (Editar el archivo si es necesario)
pm2 restart 1

Esto abrirá el archivo proxy.js para edición y luego reiniciará el proceso correspondiente mediante pm2.
2. Estructura del archivo proxy.js

Dentro del archivo proxy.js se encuentran las validaciones y lógica necesarias para permitir solicitudes solo desde orígenes permitidos:

const allowedOrigins = ['https://tudashboard.com']; // Agrega aquí tu dominio

const userAgent = req.headers['user-agent'] || '';
const referer = req.headers['referer'] || '';

if (!allowedOrigins.includes(new URL(referer).origin)) {
  return socket.end(); // Bloquea conexiones desde orígenes no permitidos
}

    🔧 Importante: Asegúrate de agregar correctamente el dominio del frontend (dashboard) a la lista allowedOrigins para que funcione en producción.

3. Variables de configuración en el archivo

Además de las verificaciones de referer, también puedes definir listas de IPs permitidas, agentes de usuario, y más:

const ALLOWED_USER_AGENTS = [...];
const ALLOWED_IPS = [...];

Estas variables se utilizan para validar cada conexión que intenta acceder al backend vía WebSocket o HTTP. Esto aumenta la seguridad general del sistema.
