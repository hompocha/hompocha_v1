import { Module } from '@nestjs/common';
import { OpenviduController } from './openvidu.controller';
import { OpenviduService } from './openvidu.service';

@Module({
  controllers: [OpenviduController],
  providers: [OpenviduService]
})
export class OpenviduModule {}
