import { Test, TestingModule } from '@nestjs/testing';
import { MypageService } from './mypage.service';

describe('MypageService', () => {
  let service: MypageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MypageService],
    }).compile();

    service = module.get<MypageService>(MypageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
