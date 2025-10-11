import {Module} from "@nestjs/common";
import {AuthController} from "@/modules/auth/presentation/auth.controller";
import {RegisterNewUser} from "@/modules/auth/application/use-cases/register-user.usecase";
import {REGISTER_USER_PORT} from "@/modules/auth/application/ports/register-user.port";

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [
        {
            provide: REGISTER_USER_PORT, useClass: RegisterNewUser
        }
    ]
})
export class AuthModule {}