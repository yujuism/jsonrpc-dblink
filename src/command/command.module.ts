import {Module} from '@nestjs/common';
import {CommandService} from './command.service';
import {CommandHandler} from './command.handler';
import {ConfigModule} from '@nestjs/config';
import {JsonRpcModule} from 'asc-rpc';
import {ElasticSearchModule} from 'src/elasticsearch/elasticsearch.module';

function getElasticsearchModule() {
  return process.env.ELASTICSEARCH_URL ? [ElasticSearchModule] : [];
}

@Module({
  imports: [
    ConfigModule,
    JsonRpcModule.forRoot({
      path: '/rpc', // path to RPC
    }),
    ...getElasticsearchModule(),
  ],
  providers: [CommandService, CommandHandler],
})
export class CommandModule {}
