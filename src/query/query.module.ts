import {Module} from '@nestjs/common';
import {QueryService} from './query.service';
import {QueryHandler} from './query.handler';
import {ConfigModule} from '@nestjs/config';
import {JsonRpcModule} from 'asc-rpc';

@Module({
  imports: [
    ConfigModule,
    JsonRpcModule.forRoot({
      path: '/rpc', // path to RPC
    }),
  ],
  providers: [QueryService, QueryHandler],
})
export class QueryModule {}
