import {Test, TestingModule} from '@nestjs/testing';
import {QueryService} from './query.service';

describe('QueryService', () => {
  let service: QueryService;

  beforeAll(async () => {
    const PengumumanProvider = {
      provide: QueryService,
      useFactory: () => ({
        find: jest.fn(() => []),
      }),
    };
    const app: TestingModule = await Test.createTestingModule({
      providers: [QueryService, PengumumanProvider],
    }).compile();

    service = app.get<QueryService>(QueryService);
  });

  it('service findAll testing with params', () => {
    const payload = 'bdang';
    const id = 'kbli';
    expect(service.find('findOne', payload, id)).toBeDefined();
  });

  it('findAll service testing with no params', () => {
    const payload = '';
    const id = null;
    expect(service.find('findAll', payload, id)).toBeDefined();
  });
});
