import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

import { Response } from 'express';
import { envs } from 'src/config';

@Catch(Error)  // Capturamos todas las excepciones de tipo Error
export class DatabaseConnectionExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception.message.includes('ECONNREFUSED')) {
      response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: 'Cannot connect to the database. Please try again later.',
      });
    } else {
      if (exception instanceof HttpException) {
        if (envs.ERRORLOGS) console.log(exception);
        const responseBody = exception.getResponse() as object || {};
        response.status(exception.getStatus()).json({
          statusCode: exception.getStatus(),
          timestamp: new Date().toISOString(),
          path: request.url,
          message: exception.message,
          ...responseBody,
        });
      } else {
        if (envs.ERRORLOGS) console.log(exception);
        // console.error(exception);
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: exception.message || 'Internal server error',
        });
      }
    }
  }
}
