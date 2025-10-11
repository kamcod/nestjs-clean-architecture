import {Module} from "@nestjs/common";
import {AuthController} from "@/modules/auth/presentation/auth.controller";
import {RegisterNewUser} from "@/modules/auth/application/use-cases/register-user.usecase";
import {REGISTER_USER_PORT} from "@/modules/auth/application/ports/register-user.port";
import {UsersModule} from "@/modules/user/user.module";
import {BcryptService} from "@/modules/auth/infrastructure/bcrypt.service";
import {BCRYPT_SERVICE} from "@/modules/auth/application/ports/bcrypt.port";

@Module({
    imports: [UsersModule],
    controllers: [AuthController],
    providers: [
        {
            provide: REGISTER_USER_PORT, useClass: RegisterNewUser
        },
        {
            provide: BCRYPT_SERVICE, useClass: BcryptService
        }
    ]
})
export class AuthModule {}