import { HttpException, HttpStatus } from '@nestjs/common';

export class ResponseDto<T = any> {
  status: string;
  message: string;
  data?: T;
  metadata?: { [key: string]: any };
  errors?: any;

  static ok<T>(data: T, metadata?: { [key: string]: any }, message?: string): ResponseDto<T> {
    return {
      status: 'success',
      message,
      data,
      metadata,
    };
  }

  static msg<T>(message?: string): ResponseDto<T> {
    return {
      status: 'success',
      message: message || 'No content',
    };
  }

  static created<T>(data: T, message?: string): ResponseDto<T> {
    return {
      status: 'success',
      message: message || 'Resource created successfully',
      data,
    };
  }

  static success<T = any>(data: T, message?: string): ResponseDto<T> {
    return {
      status: 'success',
      message: message || 'Request processed successfully',
      data,
    };
  }

  static error<T>(message: string, errors?: any): ResponseDto<T> {
    return {
      status: 'error',
      message,
      errors,
    };
  }

  static throwError<T>(errors?: any, message?: string): never {
    throw new HttpException(
      ResponseDto.error(message, errors || 'Internal server error'),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  static throwBadRequest<T>(message: string, errors?: any): never {
    throw new HttpException(ResponseDto.error(message, errors || 'Bad request'), HttpStatus.BAD_REQUEST);
  }

  static throwUnauthorized<T>(message: string, errors?: any): never {
    throw new HttpException(ResponseDto.error(message, errors || 'Unauthorized'), HttpStatus.UNAUTHORIZED);
  }

  static throwForbidden<T>(message: string, errors?: any): never {
    throw new HttpException(ResponseDto.error(message, errors || 'Forbidden'), HttpStatus.FORBIDDEN);
  }

  static throwNotFound<T>(message: string, errors?: any): never {
    throw new HttpException(ResponseDto.error(message, errors || 'Not found'), HttpStatus.NOT_FOUND);
  }
  static handleCatchError(error: any): never {
    if (error.response && error.response.status) {
      const { status, data } = error.response;
      const message = data?.message || 'An error occurred';
      const errors = data?.errors;
      switch (status) {
        case 400:
          return ResponseDto.throwBadRequest(message, errors);
        case 401:
          return ResponseDto.throwUnauthorized(message, errors);
        case 403:
          return ResponseDto.throwForbidden(message, errors);
        case 404:
          return ResponseDto.throwNotFound(message, errors);
        case 500:
          return ResponseDto.throwError(errors, message || 'Internal server error');
        default:
          return ResponseDto.throwError(errors, message || 'Unexpected error occurred');
      }
    } else if (error.request) {
      return ResponseDto.throwError('Network error or no response received from server',error);
    } else {
      return ResponseDto.throwError('An unexpected error occurred', error.message);
    }
  }
}
