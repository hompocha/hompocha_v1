import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { SavestatusDto } from './dto/savestatus.dto';
import { RoomService } from './room.service';
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

  @Get('/roomout')
  async outRoom(@Headers('authorization') headers: any) {
    const verifiedToken = this.authService.verify(headers.split('Bearer ')[1]);
    await this.roomService.outRoom(verifiedToken.idx);
  }
  @Get('/wow')
  async nickNameToSession(@Headers('authorization') headers: any) {
    const verifiedToken = this.authService.verify(headers.split('Bearer ')[1]);
    const nickName = verifiedToken.nickname;
    return nickName;
  }
}
