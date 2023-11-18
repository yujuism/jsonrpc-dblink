import {JSON_RPC_ERROR_CODES, RpcException} from 'asc-rpc';
import {Inject, Injectable} from '@nestjs/common';
import {Sequelize} from 'sequelize-typescript';
import {replaceModels} from '../utility/globals/models';
import {Cache} from 'cache-manager';
import {CACHE_MANAGER} from '@nestjs/cache-manager';
import {ConfigService} from '@nestjs/config';
@Injectable()
export class QueryService {
  constructor(
    private sequelize: Sequelize,
    private config: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async find(method: string, id: string, payload: any) {
    try {
      const logger = JSON.stringify({method, id, payload});
      // winston_logger.debug('request_payload_find', logger);
      // this.sequelize.options.logging = (param1, param2) => {
      //   console.log(param1);
      // };
      const log = await this.cacheManager.get(logger);
      if (log) {
        return {
          result: log,
        };
      } else {
        if (!Object.keys(payload).includes('attributes')) throw {message: `attributes property for ${id} is required`};
        if (!Object.keys(this.sequelize.models).includes(id)) throw {message: `model ${id} does not exists`};
        const newPayload = replaceModels(payload, this.sequelize.models);
        const request = await this.sequelize.models[id][method](newPayload);
        const ttl = this.config.get('cacheTtl');
        this.cacheManager.set(logger, request, ttl);
        return {
          result: request,
        };
      }
    } catch (error) {
      // winston_logger.error('error_find_master', error);
      throw new RpcException(error.message, JSON_RPC_ERROR_CODES.INVALID_REQUEST);
    }
  }
}
