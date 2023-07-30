import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomlistEntity } from './roomlist.entity';
import { RoomlistService } from './roomlist.service';
import { RoomlistController } from './roomlist.controller';
import { UsersEntity } from '../users/users.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { RoomEntity } from '../room/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomlistEntity, UsersEntity, RoomEntity]),
    UsersModule,
    AuthModule,
  ],
  providers: [RoomlistService],
  controllers: [RoomlistController],
})
export class RoomlistModule {}
