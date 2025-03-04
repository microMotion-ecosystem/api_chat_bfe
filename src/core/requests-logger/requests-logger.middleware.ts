import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestsLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.info(`Middleware Request: ${req.method} ${req.url}`, {
      body: req.body,
      headers: req.headers,
    });
    res.on('finish', () => {
      console.info(`Middleware Response: ${req.method} ${req.url}`, {
        json: res,
        statusCode: res.statusCode,
        headers: res.getHeaders(),
      });
    });

    next();

  }
}
