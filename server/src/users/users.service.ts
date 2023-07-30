import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ulid } from 'ulid';
import { UsersEntity } from './users.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class UsersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    private authService: AuthService,
  ) {}
  async createUser(id: string, password: string, nickname: string) {
    const hashedPassword = await this.hashPassword(password);
    await this.saveUser(/*name*/ id, hashedPassword, nickname /*phonenumber*/);
  }
  private async saveUser(id: string, password: string, nickname: string) {
    const user = new UsersEntity();
    user.idx = ulid();
    user.id = id;
    user.password = password;
    user.nickName = nickname;
    console.log(user);
    await this.userRepository.save(user);
  }
  async login(id: string, password: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('패스워드가 일치하지 않습니다.');
    }
    return this.authService.login({
      id: user.id,
      nickName: user.nickName,
      idx: user.idx,
    });
  }
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
  async checkId(userId: string): Promise<UsersEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return null;
    }
    console.log(user);
    return user;
  }

  async checkNickname(userNickname: string): Promise<UsersEntity> {
    const user = await this.userRepository.findOne({
      where: { nickName: userNickname },
    });
    if (!user) {
      return null;
    }
    console.log(user);
    return user;
  }
}
