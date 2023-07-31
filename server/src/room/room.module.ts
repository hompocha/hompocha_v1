import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomlistEntity } from '../roomlist/roomlist.entity';
import { RoomEntity } from './room.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoomlistEntity, RoomEntity]), AuthModule],
  providers: [RoomService],
  controllers: [RoomController],
})
export class RoomModule {}
