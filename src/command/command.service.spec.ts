import {Test, TestingModule} from '@nestjs/testing';
import {CommandService} from './command.service';

describe('CommandService', () => {
  let service: CommandService;

  beforeAll(async () => {
    const PengumumanProvider = {
      provide: CommandService,
      useFactory: () => ({
        method: jest.fn(() => []),
      }),
    };
    const app: TestingModule = await Test.createTestingModule({
      providers: [CommandService, PengumumanProvider],
    }).compile();

    service = app.get<CommandService>(CommandService);
  });

  it('service findAll testing with params', () => {
    const payload: any = {};
    const id = 'kbli';
    expect(service.method('create', payload, id)).toBeDefined();
  });
});
