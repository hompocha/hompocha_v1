import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Room_list')
export class RoomlistEntity {
  @PrimaryColumn()
  idx: string;

  @Column({ length: 30 })
  room_name: string;

  @Column({ length: 30 })
  room_status: string;

  @Column()
  room_max: number;

  @Column()
  peopleNum: number;
}
