import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Error } from 'mongoose';
import { AxiosError } from 'axios';

interface MongoError {
  driver?: boolean;
  code?: number;
  name?: string;
  statusCode?: number;
  status?: string;
  errmsg: string;
  index?: string;
}

interface ServerError {
  message?: string;
  code?: number;
}

@Catch()
export class CatchAppExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const object: ServerError = {};
    const res = host.switchToHttp().getResponse();
    
    // Add Axios error handling first
    if (this.isAxiosError(exception)) {
      this.handleAxiosError(exception, object);
    }
    else if (
      (exception as any)?.response?.message &&
      Array.isArray((exception as any).response.message)
    ) {
      this.handleNestError((exception as any).response, object);
    }
    else if (exception instanceof HttpException) {
      this.handleHttpException(exception, object);
    }
    else if ((exception as any).name === 'ValidationError') {
      this.handleMongoValidationError(exception as Error.ValidationError, object);
    }
    else if ((exception as any).name === 'CastError') {
      this.handleCastError(exception as Error.CastError, object);
    }
    else if ((exception as any).code === 11000) {
      this.handleDuplicationError(exception as MongoError, object);
    }
    else {
      this.internalError(res, exception);
    }

    res.status(object.code || 500).send(object);
  }

  // Add new Axios error handler
  private handleAxiosError(exception: AxiosError, object: ServerError) {
    object.code = exception.response?.status || 500;
    object.message = (exception.response?.data as any)?.message || 
                    exception.message || 
                    'External API request failed';
  }

  // Add type guard for Axios errors
  private isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError === true;
  }

  // Modify internal error handler to prevent circular references
  internalError(res, exception: unknown) {
    console.error('Server Error:', {
      message: (exception as Error)?.message,
      stack: (exception as Error)?.stack,
      name: (exception as Error)?.name,
    });

    if (process.env.NODE_ENV === 'production') {
      res.status(500).send({ message: 'Internal server error', code: 500 });
    } else {
      res.status(500).send({
        message: (exception as Error)?.message || 'Unknown error',
        name: (exception as Error)?.name || 'Error',
        code: 500
      });
    }
  }

  // Keep other handlers the same but add type safety
  handleDuplicationError(exception: MongoError, object: ServerError) {
    const val = exception.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)?.[0] || 'unknown field';
    object.message = `Duplicate value of ${val}`;
    object.code = 409; // Conflict status code
  }

  handleMongoValidationError(
    exception: Error.ValidationError,
    object: ServerError,
  ) {
    object.message = Object.values(exception.errors)
      .map((Err: Error.ValidatorError) => Err.message)
      .join(' and ');
    object.code = 400;
  }

  handleCastError(exception: Error.CastError, object: ServerError) {
    object.message = `Invalid ${exception.path} value ${exception.value}`;
    object.code = 400;
  }

  handleNestError(
    exception: { message: string[]; statusCode: number },
    object: ServerError,
  ) {
    object.message = exception.message.join(' and ');
    object.code = exception.statusCode;
  }

  handleHttpException(exception: HttpException, object: ServerError) {
    object.message = exception.message;
    object.code = exception.getStatus();
  }
}