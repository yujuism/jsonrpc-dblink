import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Observable} from 'rxjs';
import {FastifyReply} from 'fastify';
import {map} from 'rxjs/operators';

@Injectable()
export class BaseResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<FastifyReply>();
    return next.handle().pipe(
      map((data) => {
        return {
          success: true,
          data: data.result,
          message: data.message,
          meta: data.meta,
          code: response.statusCode,
        };
      }),
    );
  }
}
