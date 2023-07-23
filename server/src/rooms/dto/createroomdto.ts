import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  room_name: string;
}
