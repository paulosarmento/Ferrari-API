import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async getToken(userId: number) {
    const { email, photo, id, person } = await this.userService.get(userId);
    const { name } = person;

    return this.jwtService.sign({ name, email, photo, id });
  }
  async login({ email, password }: { email: string; password: string }) {
    const user = await this.userService.getByEmail(email);

    await this.userService.checkPassword(user.id, password);

    const token = await this.getToken(user.id);

    return {
      token,
    };
  }
}
