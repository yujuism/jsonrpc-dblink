import {Test, TestingModule} from '@nestjs/testing';
import {QueryHandler} from './query.handler';
import {QueryService} from './query.service';

describe('QueryHandler', () => {
  let controller: QueryHandler;

  beforeAll(async () => {
    const ApiServiceProvider = {
      provide: QueryService,
      useFactory: () => ({
        find: jest.fn(() => []),
      }),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [QueryHandler],
      providers: [QueryService, ApiServiceProvider],
    }).compile();

    controller = app.get<QueryHandler>(QueryHandler);
  });

  it('findAll Controller testing', () => {
    const payload = {};
    const id = 'Kbli';
    expect(controller.findAll(payload, id)).toBeDefined();
  });

  it('findAll Controller testing without params', () => {
    const payload = '';
    const id = null;
    expect(controller.findAll(payload, id)).toBeDefined();
  });

  it('findOne service test', async () => {
    const payload = '';
    const id = null;
    expect(controller.findOne(payload, id)).toBeDefined();
  });

  it('findOne service test', async () => {
    const payload = '';
    const id = null;
    expect(await controller.findOne(payload, id)).toBeDefined();
  });
});
