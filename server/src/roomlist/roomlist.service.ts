import { Injectable } from '@nestjs/common';
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
  async createRoom(room_name: string, room_max: number, user_idx) {
    // await this.checkRoomExists(id);
    const saveAndReturnIdx = await this.saveRoom(room_name, room_max);
    await this.saveUserToRoom(saveAndReturnIdx, user_idx);
    return saveAndReturnIdx;
  }
  private async saveRoom(room_name: string, room_max: number) {
    const roomList = new RoomlistEntity();
    const room_idx = ulid();
    roomList.idx = room_idx;
    roomList.room_name = room_name;
    roomList.room_max = room_max;
    roomList.room_status = 'openGame';
    roomList.peopleNum = 0;
    await this.roomListEntityRepository.save(roomList);
    console.log(roomList);
    return room_idx;
  }

  async findAllRooms() {
    try {
      const list = await this.roomListEntityRepository.find({
        select: ['idx'],
      });
      for (let i = 0; i < list.length; i++) {
        const room_idx = list[i].idx;
        if (
          !(await this.roomRepository.findOne({
            where: { room_idx: room_idx },
          }))
        ) {
          await this.roomListEntityRepository.delete({ idx: room_idx });
        }
      }
    } catch (error) {
      console.log(error);
    }
    return await this.roomListEntityRepository.find({ order: { idx: 'ASC' } });
  }
  async saveUserToRoom(room_idx: string, user_idx: string): Promise<void> {
    const room = new RoomEntity();
    room.idx = ulid();
    room.room_idx = room_idx;
    room.user_idx = user_idx;
    await this.roomRepository.save(room);
  }
  async countUserinRoom(room_idx: string) {
    const num = await this.roomRepository.countBy({ room_idx: room_idx });
    await this.roomListEntityRepository.update(
      { idx: room_idx },
      { peopleNum: num+1 },
    );
  }
}
