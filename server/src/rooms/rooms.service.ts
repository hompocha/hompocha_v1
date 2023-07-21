import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomsEntity } from './rooms.entity';

@Injectable()
export class RoomsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(RoomsEntity)
    private roomRepository: Repository<RoomsEntity>,
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
}
