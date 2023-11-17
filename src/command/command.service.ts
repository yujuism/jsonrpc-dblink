import {JSON_RPC_ERROR_CODES, RpcException} from 'asc-rpc';
import {Inject, Injectable} from '@nestjs/common';
import {Sequelize} from 'sequelize-typescript';
import {SearchService} from '../elasticsearch/elasticsearch.service';
import {Cache} from 'cache-manager';
import {CACHE_MANAGER} from '@nestjs/cache-manager';
@Injectable()
export class CommandService {
  constructor(
    private sequelize: Sequelize,
    private esService: SearchService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async method(method: string, id: string, payload: any) {
    // this.sequelize.options.logging = (sql, timing) => {
    //   console.log({sql});
    // };
    // logger.debug('payload_methos_service', {id: id, payload: payload, method: method});
    try {
      const cache = await this.cacheManager.store.keys(`*${id}*`);
      const keys = Object.keys(payload);
      if (['create', 'update'].includes(method) && !keys.includes('data')) throw {message: `data property is required`};
      const dataKeys = payload.data && Object.keys(payload.data);
      if (dataKeys && dataKeys.length === 0) throw {message: `data can't be an empty object`};
      if (['update', 'destroy', 'restore'].includes(method)) {
        if (!keys.includes('where')) throw {message: `where property is required`};
        if (Object.keys(payload.where).length === 0) throw {message: `where can't be an empty object`};
      }
      if (['create'].includes(method)) {
        if (!dataKeys.includes('created_by')) throw {message: `Field created_by is required`};
      }
      if (['update'].includes(method)) {
        if (!dataKeys.includes('updated_by')) throw {message: `Field updated_by is required`};
      }
      if (['destroy'].includes(method)) {
        if (!dataKeys.includes('deleted_by')) throw {message: `Field deleted_by is required`};
      }
      const transaction = await this.sequelize.transaction();

      try {
        const data: any = payload.data;
        const index = payload.index;
        const options: any = {
          transaction,
        };
        const where = payload.where;

        let request: any;
        if (['create'].includes(method)) request = await this.sequelize.models[id][method](data, options);
        else if (['restore'].includes(method)) {
          request = await this.sequelize.models[id][method]({where, ...options});
        } else if (['removeCache'].includes(method)) {
          // const util = require('util');
          // console.log(util.inspect(cache, false, null, true));
        } else {
          options.returning = true;
          if (['destroy'].includes(method)) {
            method = 'update';
            data.deleted_at = new Date();
          }
          request = await this.sequelize.models[id][method](data, {where, ...options});
        }

        if (process.env.ELASTICSEARCH_URL && index) {
          const elasticsearchData: any = {
            ...request.dataValues,
          };
          delete elasticsearchData.id;
          if (['create'].includes(method)) {
            await this.esService.insert(request.dataValues.id, elasticsearchData, index);
          } else {
            if (request[0] > 0)
              await Promise.all(
                request[1].map(async (item: any) => {
                  const esData = {
                    ...item.dataValues,
                  };
                  delete esData.id;
                  await this.esService.update(item.dataValues.id, esData, index);
                }),
              );
          }
        }

        transaction.commit();
        cache.forEach((element: string) => {
          this.cacheManager.del(element);
        });
        return {
          result: request,
        };
      } catch (err) {
        // logger.error('rollback_transaction', err);
        transaction.rollback();
        throw {message: err};
      }
    } catch (error) {
      // logger.error('error_method_service', error);
      throw new RpcException(error.message, JSON_RPC_ERROR_CODES.INVALID_REQUEST);
    }
  }
}
