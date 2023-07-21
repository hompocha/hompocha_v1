import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsEntity } from './rooms.entity';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoomsEntity])],
  providers: [RoomsService],
  controllers: [RoomsController],
})
export class RoomsModule {}
