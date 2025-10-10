import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { BcryptService } from './infrastructure/security/bcrypt.service';

@Module({
    providers: [PrismaService, BcryptService],
    exports: [PrismaService, BcryptService],
})
export class SharedModule {}
