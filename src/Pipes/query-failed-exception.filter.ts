import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { mongo, MongooseError } from 'mongoose';
import { envs } from 'src/config';


@Catch(mongo.MongoServerError) // Captura solo excepciones de Mongoose 
export class QueryFailedFilter implements ExceptionFilter {
  catch(exception: MongooseError & mongo.MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error desconocido';
    let stack = null

    if (envs.ERRORLOGS) console.log(exception);

    switch (exception.code) {
      case 11000:
        status = HttpStatus.CONFLICT;
        message = `${exception.message}`
        stack = {
          ...exception.errorResponse
        }
        break;
      default:
        message = 'Mongo DB Error' + exception.message;
        stack = {
          help: "Please contact the system developer; this error was not anticipated.",
          support: 'deivistm62406@gmail.com'
        };
        break;
    }

    // Respuesta HTTP
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: message,
      details: {
        name: exception.name,
        message: exception.message,
        stack: stack || exception.stack,
      },
    });
  }
}
