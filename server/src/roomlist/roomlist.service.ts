import { Injectable, NotFoundException } from '@nestjs/common';
import { ulid } from 'ulid';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomlistEntity } from './roomlist.entity';
import { UsersEntity } from '../users/users.entity';
import { RoomEntity } from '../room/room.entity';

@Injectable()
export class RoomlistService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(RoomlistEntity)
    private roomListEntityRepository: Repository<RoomlistEntity>,
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
  ) {}
  async createRoom(room_name: string) {
    // await this.checkRoomExists(id);
    await this.saveRoom(room_name);
  }
  private async saveRoom(room_name: string) {
    const roomList = new RoomlistEntity();
    roomList.idx = ulid();
    roomList.room_name = room_name;

    await this.roomListEntityRepository.save(roomList);
    console.log(roomList);
  }

  async findAllRooms() {
    return await this.roomListEntityRepository.find({ order: { idx: 'ASC' } });
  }
  async saveUserToRoom(
    room_name: string,
    room_idx: string,
    user_idx: string,
  ): Promise<void> {
    const room = new RoomEntity();
    room.idx = ulid();
    room.room_idx = room_idx;
    room.user_idx = user_idx;
    await this.roomRepository.save(room);
  }
  async countUserinRoom(room_idx: string) {
    return await this.roomRepository.countBy({ room_idx: room_idx });
  }
}
// async getRoomInfo(roomidx: string): Promise<RoomlistEntity> {
//   const roomList = await this.roomListEntityRepository.findOne({
//     where: { idx: roomidx },
//   });
//   return roomList;
// }

// async getUserJwt(userId: string): Promise<string> {
//   const user = await this.userRepository.findOne({
//     where: { id: userId },
//   });
//   if (!user) {
//     throw new NotFoundException('유저 존재 X');
//   }
//   // console.log(user.id);
//   return user.id;
// }
