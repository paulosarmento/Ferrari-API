import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async get(id: number, hash = false) {
    id = Number(id);
    if (isNaN(id)) {
      throw new BadRequestException('ID is required');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        person: true,
      },
    });
    if (!hash) {
      delete user.password;
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  async getByEmail(email: string) {
    if (!email) {
      throw new BadRequestException('E-mail is required');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        person: true,
      },
    });

    delete user.password;

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async create({
    name,
    email,
    password,
    birthAt,
    phone,
    document,
  }: {
    name: string;
    email: string;
    password: string;
    birthAt?: Date;
    phone?: string;
    document?: string;
  }) {
    if (!name) {
      throw new BadRequestException('name is required');
    }

    if (!email) {
      throw new BadRequestException('Email is required');
    }

    if (!password) {
      throw new BadRequestException('Password is required');
    }

    if (birthAt && birthAt.toString().toLowerCase() === 'invalid date') {
      throw new BadRequestException('Birth date is invalid');
    }

    let user = null;

    try {
      user = await this.getByEmail(email);
    } catch (e) {}
    if (user) {
      throw new BadRequestException('Email already exists');
    }
    const userCreated = await this.prisma.user.create({
      data: {
        person: {
          create: {
            name,
            birthAt,
            document,
            phone,
          },
        },
        email,
        password: bcrypt.hashSync(password, 10),
      },
      include: {
        person: true,
      },
    });
    delete userCreated.password;

    return userCreated;
  }
  async update(
    id: number,
    {
      name,
      email,
      birthAt,
      phone,
      document,
    }: {
      name?: string;
      email?: string;
      birthAt?: Date;
      phone?: string;
      document?: string;
    },
  ) {
    id = Number(id);

    if (isNaN(id)) {
      throw new BadRequestException('ID is not a number');
    }

    const dataUser = {} as Prisma.UserUpdateInput;
    const dataPerson = {} as Prisma.PersonUpdateInput;

    if (name) {
      dataPerson.name = name;
    }
    if (birthAt) {
      dataPerson.birthAt = birthAt;
    }
    if (phone) {
      dataPerson.phone = phone;
    }
    if (document) {
      dataPerson.document = document;
    }
    if (email) {
      dataUser.email = email;
    }

    const user = await this.get(id);

    if (dataPerson) {
      await this.prisma.person.update({
        where: {
          id: user.personId,
        },
        data: dataPerson,
      });
    }

    if (dataUser) {
      await this.prisma.user.update({
        where: {
          id: user.personId,
        },
        data: dataUser,
      });
    }

    return this.get(id);
  }
  async checkPassword(id: number, password: string) {
    const user = await this.get(id, true);

    const checked = await bcrypt.compare(password, user.password);

    if (!checked) {
      throw new UnauthorizedException('Email or password is incorrect');
    }
    return true;
  }
}
