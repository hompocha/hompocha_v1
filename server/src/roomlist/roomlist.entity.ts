import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Rooms')
export class RoomlistEntity {
  @PrimaryColumn()
  idx: string;

  @Column({ length: 30 })
  room_name: string;

  @Column({ length: 30 })
  room_status: string;

  @Column({ length: 30 })
  room_max: number;
}
