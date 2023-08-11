import { OpenVidu } from 'openvidu-node-client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

//환경변수;

@Injectable()
export class OpenviduService {
  private openvidu: OpenVidu;

  constructor(private readonly configService: ConfigService) {
    const OPENVIDU_SECRET = this.configService.get('OPENVIDU_SECRET');
    const OPENVIDU_URL = this.configService.get('OPENVIDU_URL');
    this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
  }

  async createSession(body: any) {
    try {
      const session = await this.openvidu.createSession(body);
      return session.sessionId;
    } catch (err) {
      console.log('Error stack:', err.stack);
      throw new HttpException(
        'Error Creating session: ' + err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // CREATE SESSION
  async createConnection(sessionId: string, body: any) {
    console.log('createConnection');
    const session = this.openvidu.activeSessions.find(
      (s) => s.sessionId === sessionId,
    );
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    } else {
      try {
        const connection = await session.createConnection(body);
        return connection.token;
      } catch (err) {
        throw new HttpException(
          'Error creating connection: ' + err.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
