import { Body, Controller, Headers, Post } from '@nestjs/common';
import { SavestatusDto } from './dto/savestatus.dto';
import { RoomService } from './room.service';
import { OutroomDto } from './dto/outroom.dto';
import { AuthService } from '../auth/auth.service';

@Controller('room')
export class RoomController {
  constructor(
    private roomService: RoomService,
    private authService: AuthService,
  ) {}
  @Post('/status')
  async saveRoomStatus(@Body() dto: SavestatusDto) {
    const { status, room_idx } = dto;
    await this.roomService.saveRoomStatus(status, room_idx);
  }

  @Post('/roomout')
  async outRoom(@Body() room_idx: string, @Headers() headers: any) {
    const verifiedToken = this.authService.verify(
      headers.authorization.split('Bearer ')[1],
    );
    await this.roomService.outRoom(room_idx, verifiedToken.idx);
  }
}
