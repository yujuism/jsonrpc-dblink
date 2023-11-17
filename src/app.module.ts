import {MiddlewareConsumer, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {ScheduleModule} from '@nestjs/schedule';
import {CommandModule} from './command/command.module';
import appConfig from './app.config';
import {SequelizeModule} from '@nestjs/sequelize';
import {ElasticSearchModule} from './elasticsearch/elasticsearch.module';
import * as redisStore from 'cache-manager-ioredis';
import {RpcMiddleware} from './utility/middleware/Rpc.midleware';
import {CacheModule} from '@nestjs/cache-manager';
import {LoggerMiddleware} from './utility/middleware/logger.middleware';
import {NestModule} from '@nestjs/common/interfaces/modules/nest-module.interface';
import {QueryModule} from './query/query.module';
import * as resolve from 'resolve';
import * as npm from 'npm-programmatic';

function isModuleInstalled(moduleName: string): boolean {
  try {
    resolve.sync(moduleName, {basedir: process.cwd()});
    return true;
  } catch (error) {
    return false;
  }
}
function getHandlerModules() {
  const modules = [];
  if (process.env.COMMAND_HANDLER !== 'false') modules.push(CommandModule);
  if (process.env.QUERY_HANDLER !== 'false') modules.push(QueryModule);
  return modules;
}
function getElasticsearchModule() {
  return process.env.ELASTICSEARCH_URL ? [ElasticSearchModule] : [];
}
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development.local', '.env.development', '.env.staging'],
      load: [appConfig],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          store: redisStore,
          host: config.get<string>('redisHost'),
          port: config.get<number>('redisPort'),
          password: config.get<string>('redisPassword'),
          db: 7,
          ttl: 3600 * 24,
        };
      },
      inject: [ConfigService],
    }),
    ...getElasticsearchModule(),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const moduleName = configService.get('dbmodule');
        if (!isModuleInstalled(moduleName)) {
          await npm.install(moduleName, {
            // save: true,
            cwd: process.cwd(),
            loglevel: 'verbose',
          });
        }
        const models = await import(moduleName);
        return {
          dialect: 'postgres',
          username: configService.get('dbuser'),
          password: configService.get('dbpassword'),
          database: configService.get('dbname'),
          host: configService.get('dbhost'),
          port: configService.get('dbport'),
          logging: false,
          storage: ':memory:',
          dialectOptions: {
            supportBigNumbers: true,
            decimalNumbers: true,
          },
          pool: {
            max: 50,
            min: 0,
            acquire: 1000000,
            idle: 2000000,
          },
          models: Object.keys(models).map((key) => models[key]),
        };
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    ...getHandlerModules(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RpcMiddleware, LoggerMiddleware).forRoutes('*');
  }
}
