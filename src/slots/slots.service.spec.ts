/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { SlotService } from './slots.service';

describe('SlotService', () => {
  let service: SlotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlotService],
    }).compile();

    service = module.get<SlotService>(SlotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
