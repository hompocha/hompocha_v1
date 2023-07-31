import { OpenVidu } from 'openvidu-node-client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// const OPENVIDU_URL = 'http://localhost:4443'; //process.env.OPENVIDU_URL; //'https://hompocha.site:8443';
const OPENVIDU_URL = 'https://seomik.shop:8443'; //process.env.OPENVIDU_URL; //'https://hompocha.site:8443';
// const OPENVIDU_SECRET = '229';
const OPENVIDU_SECRET = '8782';

@Injectable()
export class OpenviduService {
  private openvidu: OpenVidu;

  constructor() {
    this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
  }

  async createSession(body: any) {
    try {
      console.log('create session', OPENVIDU_URL);
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
