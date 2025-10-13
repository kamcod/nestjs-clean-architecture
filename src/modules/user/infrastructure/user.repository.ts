import {PrismaService} from "@/shared/infrastructure/prisma/prisma.service";
import {User} from "@/modules/user/domain/user.entity";
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

        return new User(record.id, record.email, record.name, record.password, record.createdAt, record.updatedAt);
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) return null;
        return new User(user.id, user.email, user.name, user.password);
    }

    async findByID(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) return null;
        return new User(user.id, user.email, user.name, user.password);
    }
}