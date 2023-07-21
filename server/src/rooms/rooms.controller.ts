import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRoomDto } from './dto/createroomdto';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private roomService: RoomsService) {}
  @Post('/create')
  async createRoom(@Body() dto: CreateRoomDto): Promise<void> {
    const { room_name } = dto;
    await this.roomService.createRoom(room_name);
  }

  @Get()
  async getAllRooms() {
    return await this.roomService.findAllRooms();
  }
  @Get(':idx')
  async getRoomInfo(@Param('id') roomidx: string) {
    return await this.roomService.getRoomInfo(roomidx);
  }
}
