import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ToroomDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  room_name: string;

  @IsNotEmpty()
  @IsString()
  idx: string;
}
