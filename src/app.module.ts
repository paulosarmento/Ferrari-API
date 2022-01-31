import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';

@Module({
  imports: [UserModule, PrismaModule],
  controllers: [AppController, UserController],
  providers: [],
})
export class AppModule {}
