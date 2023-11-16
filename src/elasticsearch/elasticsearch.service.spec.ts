import {Test, TestingModule} from '@nestjs/testing';
import {SearchService} from './elasticsearch.service';

describe('SearchService', () => {
  let service: SearchService;
  beforeAll(async () => {
    const ApiServiceProvider = {
      provide: SearchService,
      useFactory: () => ({
        search: jest.fn(() => []),
        insert: jest.fn(() => []),
        update: jest.fn(() => []),
      }),
    };
    const app: TestingModule = await Test.createTestingModule({
      providers: [SearchService, ApiServiceProvider],
    }).compile();

    service = app.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    const bodySearch = {
      size: 12,
      query: {
        match: {
          jenis: {
            query: '',
            fuzziness: 'AUTO',
          },
        },
      },
    };
    expect(service.search(bodySearch, 'pelayanan_mekanisme_pengawasan')).toBeDefined();
  });
  it('should be defined', () => {
    const bodySearch = {
      size: 12,
      query: {
        match: {
          jenis: {
            query: '',
            fuzziness: 'AUTO',
          },
        },
      },
    };
    const id = '6322e21cd3bd55f651979ffc';
    expect(service.insert(id, bodySearch, 'pelayanan_mekanisme_pengawasan')).toBeDefined();
  });
  it('should be defined', () => {
    const bodySearch = {
      size: 12,
      query: {
        match: {
          jenis: {
            query: '',
            fuzziness: 'AUTO',
          },
        },
      },
    };
    const id = '6322e21cd3bd55f651979ffc';
    expect(service.update(id, bodySearch, 'pelayanan_mekanisme_pengawasan')).toBeDefined();
  });
});
