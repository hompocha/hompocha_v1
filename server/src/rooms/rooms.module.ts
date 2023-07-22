import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsEntity } from './rooms.entity';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { UsersEntity } from '../users/users.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomsEntity, UsersEntity]),
    UsersModule,
    AuthModule,
  ],
  providers: [RoomsService],
  controllers: [RoomsController],
})
export class RoomsModule {}
