import {Module} from "@nestjs/common";
import {UsersController} from "@/modules/user/presentation/user.controller";
import {PrismaService} from "@/shared/infrastructure/prisma/prisma.service";
import {USER_REPOSITORY} from "@/modules/user/application/user.port";
import {UsersRepository} from "@/modules/user/infrastructure/user.repository";

@Module({
    imports: [],
    controllers: [UsersController],
    providers: [
        PrismaService,
        {provide: USER_REPOSITORY, useClass: UsersRepository}
    ],
    exports: [USER_REPOSITORY]
})

export class UsersModule {}