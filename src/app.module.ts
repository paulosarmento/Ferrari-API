import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [MailModule, AuthModule, UserModule, PrismaModule],
  controllers: [AppController, UserController, AuthController],
  providers: [],
})
export class AppModule {}
