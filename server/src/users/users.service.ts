import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ulid } from 'ulid';
import { UsersEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
  ) {}
  async createUser(id: string, password: string) {
    // await this.checkUserExists(id);
    await this.saveUser(/*name*/ id, password /*phonenumber*/);
  }
  private async saveUser(id: string, password: string) {
    const user = new UsersEntity();
    user.idx = ulid();
    user.id = id;
    user.password = password;
    await this.userRepository.save(user);
    console.log(user);
  }
  async login(id: string, password: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id, password },
    });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    console.log(user);
  }
  async checkId(userId: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return userId;
    }
    console.log(user);
  }
}
