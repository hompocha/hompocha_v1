import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { AuthModule } from '../auth/auth.module';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), AuthModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
