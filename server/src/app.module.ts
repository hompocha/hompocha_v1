import { Module } from '@nestjs/common';
import { OpenviduModule } from './openvidu/openvidu.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users/users.entity';
import { RoomsModule } from './rooms/rooms.module';
import { RoomsEntity } from './rooms/rooms.entity';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    OpenviduModule,
    UsersModule,
    RoomsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'hompochadb.cluster-cyde9iiaq1yc.ap-northeast-2.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: 'hompocha229',
      database: 'test_DB',
      entities: [UsersEntity, RoomsEntity],
      synchronize: true
    }),
  ],
})
export class AppModule {}
