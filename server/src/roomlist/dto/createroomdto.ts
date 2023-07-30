import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  readonly room_name: string;

  @IsNotEmpty()
  @IsNumber()
  room_max: number;
}
