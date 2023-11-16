import {CommandService} from './command.service';
import {RpcId, RpcPayload, RpcMethodHandler, RpcHandler} from 'asc-rpc';

require('dotenv').config('../.env');
@RpcHandler({
  method: process.env.COMMAND_METHOD_OVERRIDE || 'command',
})
export class CommandHandler {
  constructor(private readonly commandService: CommandService) {}
  @RpcMethodHandler('create')
  public async create(@RpcPayload() payload: any, @RpcId() id: string) {
    return await this.commandService.method('create', id, payload);
  }
  @RpcMethodHandler('bulkCreate')
  public async bulkCreate(@RpcPayload() payload: any, @RpcId() id: string) {
    return await this.commandService.method('bulkCreate', id, payload);
  }
  @RpcMethodHandler('update')
  public async update(@RpcPayload() payload: any, @RpcId() id: string) {
    return await this.commandService.method('update', id, payload);
  }
  @RpcMethodHandler('destroy')
  public async destroy(@RpcPayload() payload: any, @RpcId() id: string) {
    return await this.commandService.method('destroy', id, payload);
  }
  @RpcMethodHandler('removeCache')
  public async removeCache(@RpcPayload() payload: any, @RpcId() id: string) {
    return await this.commandService.method('removeCache', id, payload);
  }
  @RpcMethodHandler('restore')
  public async restore(@RpcPayload() payload: any, @RpcId() id: string) {
    return await this.commandService.method('restore', id, payload);
  }
  @RpcMethodHandler('migrate')
  public async migrate(@RpcPayload() payload: any, @RpcId() id: string) {
    return;
  }
}
