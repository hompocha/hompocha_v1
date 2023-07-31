import { Body, Controller, Get, Param, Post, Headers } from '@nestjs/common';
import { CreateRoomDto } from './dto/createroomdto';
import { RoomlistService } from './roomlist.service';
import { AuthService } from '../auth/auth.service';
import { ToroomDto } from './dto/toroom.dto';

@Controller('lobby')
export class RoomlistController {
  constructor(
    private roomService: RoomlistService,
    private authService: AuthService,
  ) {}
  @Post('/create')
  async createRoom(@Body() dto: CreateRoomDto, @Headers() headers: any) {
    const { room_name, maxPeople } = dto;
    const verifiedToken = this.authService.verify(
      headers.authorization.split('Bearer ')[1],
    );

    return await this.roomService.createRoom(
      room_name,
      maxPeople,
      verifiedToken.idx,
    );
    
  }

  @Get()
  async getNickname(@Headers() headers: any) {
    const verifiedToken = this.authService.verify(
      headers.authorization.split('Bearer ')[1],
    );
    return verifiedToken.nickname;
  }

  @Get('/roomList')
  async getAllRooms() {
    return await this.roomService.findAllRooms();
  }
  @Post('/roomInfo')
  async saveUserToRoom(@Body() roomDto: ToroomDto, @Headers() headers: any) {
    const { idx } = roomDto;
    const verifiedToken = this.authService.verify(
      headers.authorization.split('Bearer ')[1],
    );
    await this.roomService.countUserinRoom(idx);
    await this.roomService.saveUserToRoom(idx, verifiedToken.idx);
  }
}
