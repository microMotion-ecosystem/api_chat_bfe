import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { MongodbModule } from './config/mongodb.module';
import { HttpModule } from '@nestjs/axios';
import { AuthApiService } from './api-services/auth-api/auth-api.service';
import { CheckHeaderMiddleware } from './core/platform-key-middleware/check-header.middleware';
import { JwtStrategy } from './core/jwt-auth-guard/jwt.strategy';
import { RabbitMqConfigModule } from './config/rabbitmq-config.module';
import { RequestsLoggerMiddleware } from './core/requests-logger/requests-logger.middleware';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './core/requests-logger/requests-logger.interceptor';
import { AddXClientServiceNameInterceptor } from './core/add-xclient-service-name/add-xclient-service-name.interceptor';
import { MyHttpService } from "./core/my-http-client-service/my-http.service";
import { LlmController } from './controllers/llm.controller';
import { LlmService } from './services/llm.service';
import { AuthProxyService } from './services/auth-proxy.service';
import { AuthController } from './controllers/auth.controller';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { SessionService } from './services/session.service';
import { SessionController } from './controllers/session.controller';
import { CatchAppExceptionsFilter } from './core/error-handling/error.filter';

@Module({
  imports: [MongodbModule, HttpModule, RabbitMqConfigModule],
  controllers: [AppController, LlmController, AuthController, ChatController, SessionController],
  providers: [
    AppService,
    AuthApiService,
    JwtStrategy,
    MyHttpService,
    LlmService,
    AuthProxyService,
    ChatService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AddXClientServiceNameInterceptor,
    },
    SessionService,
    { provide: APP_FILTER, useClass: CatchAppExceptionsFilter },

  ],
})
export class AppModule implements NestModule {
  // MiddlewareConsumer is used to configure the middleware vvv
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        CheckHeaderMiddleware,
        RequestsLoggerMiddleware,
        /* , otherMiddleWare */
      )
      .forRoutes(
        { path: '*', method: RequestMethod.ALL } /* OR AppController */,
      );
    /*  // to implement other middleware:
     consumer
          .apply(NewMiddleware)
          .forRoutes({ path: 'demo', method: RequestMethod.GET });*/
  }
}
