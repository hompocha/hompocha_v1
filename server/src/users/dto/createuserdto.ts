import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly nickName: string;

  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  // @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/) // 8-30 자리
  readonly password: string;
}
