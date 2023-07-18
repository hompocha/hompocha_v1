import { Module } from '@nestjs/common';
import { OpenviduModule } from './openvidu/openvidu.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [OpenviduModule],
})
export class AppModule {}
