import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomlistEntity } from '../roomlist/roomlist.entity';
import { DataSource, Repository } from 'typeorm';
import { RoomEntity } from './room.entity';

@Injectable()
export class RoomService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(RoomlistEntity)
    private roomListEntityRepository: Repository<RoomlistEntity>,
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
  ) {}
  async saveRoomStatus(status, room_idx) {
    await this.roomListEntityRepository.update(
      { idx: room_idx },
      { room_status: status },
    );
  }
  async outRoom(room_idx, user_idx) {
    await this.roomRepository.delete({
      room_idx: room_idx,
      user_idx: user_idx,
    });
  }
}
