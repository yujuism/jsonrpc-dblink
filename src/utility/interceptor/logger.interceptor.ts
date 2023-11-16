import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {FastifyReply, FastifyRequest} from 'fastify';
import {Observable} from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const res = context.switchToHttp().getResponse<FastifyReply>();

    const options = {
      receivedTime: new Date().toISOString(),
      logEnvironment: process.env.LOG_MODE || 'stdout',
      logMode: process.env.NODE_ENV || 'staging',
    };
    res.raw.on('finish', () => {
      // logger.sendFastify(req, res, options);
    });
    return next.handle();
  }
}
