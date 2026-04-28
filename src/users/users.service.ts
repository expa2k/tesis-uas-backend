import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { users } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<users | null> {
    return this.prisma.users.findUnique({ where: { email } });
  }

  async findByEmailWithPassword(email: string): Promise<users | null> {
    // Prisma returns all fields by default, so password is included
    return this.prisma.users.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<users | null> {
    return this.prisma.users.findUnique({ where: { id } });
  }

  async create(data: Partial<users>): Promise<users> {
    return this.prisma.users.create({ data: data as any });
  }

  async update(id: number, dto: UpdateUserDto): Promise<users> {
    return this.prisma.users.update({
      where: { id },
      data: dto as any,
    });
  }
}
