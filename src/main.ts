import {NestFactory} from '@nestjs/core';
import {NestFastifyApplication, FastifyAdapter} from '@nestjs/platform-fastify';
import {v4 as uuidv4} from 'uuid';
import {HttpExceptionFilter} from './utility/filter/http-exception.filter';
import {BaseResponseInterceptor} from './utility/interceptor/base-response.interceptor';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';
import {LoggerInterceptor} from './utility/interceptor/logger.interceptor';

async function bootstrap() {
  try {
    const PORT = process.env.PORT;
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({
        logger: true,
        genReqId: () => uuidv4(),
      }),
    );
    app.useGlobalPipes(new ValidationPipe()); // enable ValidationPipe`
    app.useGlobalInterceptors(new LoggerInterceptor());
    app.useGlobalInterceptors(new BaseResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.enableCors({origin: '*'});
    await app.listen(PORT, '0.0.0.0');
  } catch (error) {
    // logger.error('error_main', error);
  }
}
bootstrap();

process.on('unhandledRejection', function (reason) {
  // logger.fatal('unhandled_rejection', reason);
});
