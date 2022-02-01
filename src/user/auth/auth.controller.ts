import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { parse } from 'date-fns';
import { UserService } from '../user.service';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post()
  async verifyEmail(@Body('email') email) {
    try {
      await this.userService.getByEmail(email);
    } catch (e) {
      return { exists: false };
    }
  }
  @Post('register')
  async register(
    @Body('name') name,
    @Body('email') email,
    @Body('password') password,
    @Body('phone') phone,
    @Body('document') document,
    @Body('birthAt') birthAt,
  ) {
    if (birthAt) {
      try {
        birthAt = parse(birthAt, 'yyyy-MM-dd', new Date());
      } catch (e) {
        throw new BadRequestException('Birth date is invalid');
      }
    }

    return this.userService.create({
      name,
      email,
      password,
      phone,
      document,
      birthAt,
    });
  }
}