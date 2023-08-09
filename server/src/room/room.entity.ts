import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Rooms')
export class RoomEntity {
  @PrimaryColumn()
  idx: string;

  @Column({ length: 60 })
  room_idx: string;

  @Column({ length: 60 })
  user_idx: string;
}
