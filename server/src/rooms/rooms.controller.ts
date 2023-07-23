import { Body, Controller, Get, Param, Post, Headers } from '@nestjs/common';
import { CreateRoomDto } from './dto/createroomdto';
import { RoomsService } from './rooms.service';
import { AuthService } from '../auth/auth.service';
import { UserInfo } from '../users/user.info';
import { UserLoginDto } from './dto/roomfind.dto';

@Controller('lobby')
export class RoomsController {
  constructor(
    private roomService: RoomsService,
    private authService: AuthService,
  ) {}
  @Post('/create')
  async createRoom(@Body() dto: CreateRoomDto): Promise<void> {
    const { room_name } = dto;
    await this.roomService.createRoom(room_name);
  }

  @Get()
  async getUserJwt(@Headers() headers: any): Promise<any> {
    const jwtstring = headers.authorization.split('Bearer ')[1];
    const verifiedToken = this.authService.verify(jwtstring);
    return await this.roomService.getUserJwt(verifiedToken.userId);
  }
  
  @Get('/roomList')
  async getAllRooms() {
    return await this.roomService.findAllRooms();
  }
}
