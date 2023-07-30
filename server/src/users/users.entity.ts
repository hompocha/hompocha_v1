import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('User')
export class UsersEntity {
  @PrimaryColumn()
  idx: string;

  @Column({ length: 60 })
  nickName: string;

  @Column({ length: 60 })
  id: string;

  @Column({ length: 300 })
  password: string;
  //
  // @Column({ length: 60 })
  // phonenumber: string;
}
