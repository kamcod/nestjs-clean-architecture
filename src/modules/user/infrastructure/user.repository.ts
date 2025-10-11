import {PrismaService} from "@/shared/infrastructure/prisma/prisma.service";
import {User} from "@/modules/user/application/user.entity";
import {Injectable} from "@nestjs/common";
import {UserRepository} from "@/modules/user/application/user.port";
import {CreateUserDto} from "@/modules/auth/presentation/dtos/user.dto";

@Injectable()
export class UsersRepository implements UserRepository{
    constructor(private readonly prisma: PrismaService) {}

    async createUser(userData: CreateUserDto): Promise<User> {
        const record = await this.prisma.user.create({
            data: userData,
        });

        return new User(record.id, record.email, record.password, record.name, record.createdAt, record.updatedAt);
    }
}