import {Body, Controller, Inject, Post} from "@nestjs/common";
import {CreateUserDto} from "@/modules/auth/presentation/dtos/user.dto";
import { REGISTER_USER_PORT} from "@/modules/auth/application/ports/register-user.port";
import type {RegisterUserPort} from "@/modules/auth/application/ports/register-user.port";


@Controller('auth')

export class AuthController {
    constructor(
        @Inject(REGISTER_USER_PORT)
        private readonly registerUserUseCase: RegisterUserPort
    ){}

    @Post('register')
    async register(@Body() dto: CreateUserDto){
        return await this.registerUserUseCase.register(dto);
    }
}