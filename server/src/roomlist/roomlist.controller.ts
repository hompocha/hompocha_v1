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
  async createRoom(@Body() dto: CreateRoomDto): Promise<void> {
    const { room_name } = dto;
    await this.roomService.createRoom(room_name);
  }
  @Get('/roomList')
  async getAllRooms() {
    return await this.roomService.findAllRooms();
  }
  @Post('/roomInfo')
  async saveUserToRoom(@Body() roomDto: ToroomDto, @Headers() headers: any) {
    const { room_name, idx } = roomDto;
    const verifiedToken = this.authService.verify(
      headers.authorization.split('Bearer ')[1],
    );
    await this.roomService.saveUserToRoom(room_name, idx, verifiedToken.idx);
  }


}
