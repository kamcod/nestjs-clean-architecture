import {Module} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {AuthController} from "@/modules/auth/presentation/auth.controller";
import {RegisterNewUser} from "@/modules/auth/application/use-cases/register-user.usecase";
import {REGISTER_USER_PORT, LOGIN_USER_PORT, REFRESH_TOKEN_PORT} from "@/modules/auth/application/ports/user.port";
import {UsersModule} from "@/modules/user/user.module";
import {BcryptService} from "@/modules/auth/infrastructure/bcrypt.service";
import {BCRYPT_SERVICE} from "@/modules/auth/application/ports/bcrypt.port";
import {LoginUser} from "@/modules/auth/application/use-cases/login-user.usecase";
import {RefreshToken} from "@/modules/auth/application/use-cases/refresh-token.usecase";

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '7d' }
        })
    ],
    controllers: [AuthController],
    providers: [
        { provide: REGISTER_USER_PORT, useClass: RegisterNewUser },
        { provide: BCRYPT_SERVICE, useClass: BcryptService },
        { provide: LOGIN_USER_PORT, useClass: LoginUser },
        { provide: REFRESH_TOKEN_PORT, useClass: RefreshToken },
    ]
})
export class AuthModule {}