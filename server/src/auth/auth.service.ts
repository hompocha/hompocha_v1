import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import authConfig from '../config/auth.config';
interface User {
  id: string;
  nickName: string;
  idx: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
  ) {}

  login(user: User) {
    const payload = { ...user };
    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: '1d',
      audience: 'hompocha.site',
      issuer: 'hompocha.site',
    });
  }
  verify(jwtString: string) {
    try {
      const payload = jwt.verify(jwtString, this.config.jwtSecret) as (
        | jwt.JwtPayload
        | string
      ) &
        User;

      const { id, nickName, idx } = payload;
      return {
        userId: id,
        nickname: nickName,
        idx: idx,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
