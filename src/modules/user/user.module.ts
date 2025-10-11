import {Module} from "@nestjs/common";
import {UsersController} from "@/modules/user/presentation/user.controller";
import {PrismaService} from "@/shared/infrastructure/prisma/prisma.service";

@Module({
    imports: [],
    controllers: [UsersController],
    providers: [PrismaService]
})

export class UsersModule {}