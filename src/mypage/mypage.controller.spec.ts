import { Test, TestingModule } from '@nestjs/testing';
import { MypageController } from './mypage.controller';

describe('MypageController', () => {
  let controller: MypageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MypageController],
    }).compile();

    controller = module.get<MypageController>(MypageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
