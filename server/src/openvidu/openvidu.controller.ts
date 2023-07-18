import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { OpenviduService } from './openvidu.service';

@Controller('openvidu/api')
export class OpenviduController {
    constructor(private readonly openviduService: OpenviduService) {}
  
    @Get()
    connected() {
      return {data: "connected!"};
    }

    @Post('sessions')
    async createSession(@Body() body: any) {
      return this.openviduService.createSession(body);
    }
  
    @Post('sessions/:sessionId/connections')
    async createConnection(
      @Param('sessionId') sessionId: string,
      @Body() body: any,
    ) {
      return this.openviduService.createConnection(sessionId, body);
    }
  }
