import { Injectable, NotFoundException } from '@nestjs/common';
import { ulid } from 'ulid';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomsEntity } from './rooms.entity';
import { UsersEntity } from '../users/users.entity';
import { UserInfo } from '../users/user.info';

@Injectable()
export class RoomsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(RoomsEntity)
    private roomRepository: Repository<RoomsEntity>,
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
  ) {}
  async createRoom(room_name: string) {
    // await this.checkRoomExists(id);
    await this.saveRoom(room_name);
  }
  private async saveRoom(room_name: string) {
    const room = new RoomsEntity();
    room.idx = ulid();
    room.room_name = room_name;

    await this.roomRepository.save(room);
    console.log(room);
  }

  async findAllRooms() {
    const rooms = await this.roomRepository.find({ order: { idx: 'ASC' } });
    return rooms;
  }
  async getRoomInfo(roomidx: string): Promise<RoomsEntity> {
    const room = await this.roomRepository.findOne({
      where: { idx: roomidx },
    });
    return room;
  }

  async getUserJwt(userId: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('유저 존재 X');
    }
    // console.log(user.id);
    return user.id;
  }
}
