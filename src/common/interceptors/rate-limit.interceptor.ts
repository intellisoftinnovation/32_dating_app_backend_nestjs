import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RATE_LIMIT_METADATA_KEY } from '../decorators/rate-limit.decorator';
import { Reflector } from '@nestjs/core';

const requestLog: Map<string, { count: number; startTime: number }> = new Map();

@Injectable()
// DOC: la estartegia se aplica calculando la cantidad de peticiones que se hacen en un intervalo de tiempo en milisegundos
export class RateLimitInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();
    const rateLimitConfig = this.reflector.get<{ limit: number; timeWindow: number }>(RATE_LIMIT_METADATA_KEY, handler);

    if (!rateLimitConfig) {
      return next.handle();
    }

    const { limit, timeWindow } = rateLimitConfig;
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.connection.remoteAddress;

    const currentTime = Date.now();
    const record = requestLog.get(ip);

    if (!record || currentTime - record.startTime > timeWindow) {
      
      requestLog.set(ip, { count: 1, startTime: currentTime });
    } else {
      
      record.count += 1;
      if (record.count > limit) {
        throw new HttpException({message:'Rate limit exceded, try again later' }, HttpStatus.TOO_MANY_REQUESTS)
      }
    }

    return next.handle();
  }
}
