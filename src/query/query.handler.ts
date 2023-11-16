import {QueryService} from './query.service';
import {RpcId, RpcPayload, RpcMethodHandler, RpcHandler} from 'asc-rpc';

require('dotenv').config('../.env');
@RpcHandler({
  method: process.env.QUERY_METHOD_OVERRIDE || 'query',
})
export class QueryHandler {
  constructor(private readonly queryService: QueryService) {}
  @RpcMethodHandler('findAll')
  public async findAll(@RpcPayload() payload: any, @RpcId() id: string) {
    return await this.queryService.find('findAll', id, payload);
  }
  @RpcMethodHandler('findAndCountAll')
  public async findAndCountAll(@RpcPayload() payload: any, @RpcId() id: string) {
    return await this.queryService.find('findAndCountAll', id, payload);
  }
  @RpcMethodHandler('findOne')
  public async findOne(@RpcPayload() payload: any, @RpcId() id: string) {
    return await this.queryService.find('findOne', id, payload);
  }
}
