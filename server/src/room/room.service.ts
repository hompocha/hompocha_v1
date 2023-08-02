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
  async outRoom(user_idx) {
    const room = await this.roomRepository.findOne({
      where: { user_idx: user_idx },
    });
    console.log(room);
    if (room) {
      const num = await this.roomRepository.countBy({
        room_idx: room.room_idx,
      });
      await this.roomListEntityRepository.update(
        { idx: room.room_idx },
        { peopleNum: num - 1 },
      );
    }
    await this.roomRepository.delete({
      user_idx: user_idx,
    });
  }
}
