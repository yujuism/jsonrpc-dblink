import {ExceptionFilter, Catch, ArgumentsHost, HttpException} from '@nestjs/common';
import {FastifyReply} from 'fastify';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    let responseMessage = exceptionResponse;
    if (typeof exceptionResponse === 'object' && exceptionResponse) {
      responseMessage = exceptionResponse['message'];
    }
    response.status(status).send({
      success: false,
      data: null,
      message: responseMessage,
      code: status,
    });
  }
}
