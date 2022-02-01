import { AuthModule } from './user/auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { AuthController } from './user/auth/auth.controller';

@Module({
  imports: [AuthModule, UserModule, PrismaModule],
  controllers: [AppController, UserController, AuthController],
  providers: [],
})
export class AppModule {}
