import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Rooms')
export class RoomsEntity {
  @PrimaryColumn()
  idx: string;

  @Column({ length: 30 })
  room_name: string;

  // @Column({length: 30})
  // room_
}
