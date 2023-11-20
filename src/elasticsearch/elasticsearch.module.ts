import {Module} from '@nestjs/common';
import {ElasticsearchModule} from '@nestjs/elasticsearch';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {SearchService} from './elasticsearch.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const url = configService.get('elasticsearchUrl');
        return {
          node: url ? url : 'http://elasticsearch',
          auth: {
            username: configService.get('elasticsearchUsername'),
            password: configService.get('elasticsearchPassword'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [SearchService],
  exports: [SearchService],
})
export class ElasticSearchModule {}
