import {Injectable, HttpException, HttpStatus} from '@nestjs/common';
import {ElasticsearchService} from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly esService: ElasticsearchService) {}
  async search(body: any, index: string) {
    // logger.debug('payload_search_elastic', {payload: body, index: index});
    try {
      const result: any = await this.esService.search({
        index: index,
        body: body,
      });
      return result;
    } catch (error) {
      // logger.error('error_search_elastic', error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async update(id: string, body: any, index: string) {
    // logger.debug('payload_update_elastic', {id: id, payload: body, index: index});
    try {
      const result: any = await this.esService.update({
        index: index,
        id: id,
        body: {doc: body},
      });
      return result;
    } catch (error) {
      // logger.error('error_update_elastic', error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async insert(id: string, body: any, index: string) {
    // logger.debug('payload_insert_elastic', {id: id, payload: body, index: index});
    try {
      const result: any = await this.esService.index({
        index: index,
        id: id,
        body: body,
      });
      return result;
    } catch (error) {
      // logger.error('error_insert_elastic', error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async bulkInsert(id: string, body: any[], index: string) {
    const data = body.map((doc) => [{index: {_index: index}}, id, doc]);

    try {
      const result = await this.esService.bulk({
        index,
        body: data,
      });
      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
