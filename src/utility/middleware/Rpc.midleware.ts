import {HttpException, HttpStatus, Injectable, NestMiddleware} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {FastifyRequest, FastifyReply, HookHandlerDoneFunction} from 'fastify';
// import {Sequelize} from 'sequelize-typescript';

@Injectable()
export class RpcMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}
  use(req: FastifyRequest, res: FastifyReply, next: HookHandlerDoneFunction) {
    const key = req.headers['master-api-key'];
    // this.sequelize.options.logging = (query: any) => {
    //   console.log(query.replace(/Executing \(default\)\: /, ''));
    // };
    if (key === this.configService.get('apiKey')) {
      next();
    } else {
      // logger.debug('invalid_apiKey', key);
      return next(
        new HttpException(
          {
            message: 'Forbidden',
          },
          HttpStatus.FORBIDDEN,
        ),
      );
    }
  }
}
