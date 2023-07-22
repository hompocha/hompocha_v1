import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createuserdto';
import { UserLoginDto } from './dto/user.login';

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { id, password } = dto;
    await this.userService.createUser(id, password);
  }
  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { loginId, loginPassword } = dto;
    const jwt_log = await this.userService.login(loginId, loginPassword);
    console.log(jwt_log);
    return jwt_log;
  }
  @Get('/:id')
  async checkId(@Param('id') userId: string): Promise<void> {
    await this.userService.checkId(userId);
  }
}
