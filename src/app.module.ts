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
import * as fs from 'fs';
import {execSync} from 'child_process';
import * as os from 'os';
import * as path from 'path';

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
    ElasticSearchModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const moduleName = configService.get('dbmodule');
        let gitUrl = configService.get('gitUrl');
        if (gitUrl) gitUrl = 'git+' + gitUrl;
        const sshPublicBase64 = configService.get('sshPublic');
        const sshPrivateBase64 = configService.get('sshPrivate');
        const gitHost = configService.get('gitHost');
        const gitPort = configService.get('gitPort') || '22';

        if (gitUrl && sshPublicBase64 && sshPrivateBase64 && gitHost) {
          const sshDir = path.join(os.homedir(), '.ssh');
          if (!fs.existsSync(sshDir)) fs.mkdirSync(sshDir);

          fs.writeFileSync(path.join(sshDir, `id_ed25519.pub`), Buffer.from(sshPublicBase64, 'base64'));
          fs.writeFileSync(path.join(sshDir, `id_ed25519`), Buffer.from(sshPrivateBase64, 'base64'));
          fs.chmodSync(path.join(sshDir, `id_ed25519`), '600');
          execSync(`ssh-keyscan -p ${gitPort} ${gitHost} >> ${path.join(sshDir, `known_hosts`)}`);
        }
        const moduleToInstall = gitUrl ? gitUrl : moduleName;
        if (!isModuleInstalled(moduleName)) {
          await npm.install(moduleToInstall, {
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
