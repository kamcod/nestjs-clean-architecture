import {PrismaService} from "@/shared/infrastructure/prisma/prisma.service";
import {User} from "@/modules/user/application/user.entity";
import {Injectable} from "@nestjs/common";

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(user: User): Promise<User> {
        const record = await this.prisma.user.create({
            data: {
                // id: user.id,
                email: user.email,
                password: user.password,
                name: user.name,
            },
        });

        return new User(record.id, record.email, record.password, record.name, record.createdAt, record.updatedAt);
    }
}