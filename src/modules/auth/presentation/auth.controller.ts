import {Body, Controller, Post} from "@nestjs/common";
import {RegisterNewUser} from "@/modules/auth/application/use-cases/register-user.usecase";
import {CreateUserDto} from "@/modules/auth/presentation/dtos/user.dto";


@Controller('auth')

export class AuthController {
    constructor(){}

    @Post('register')
    async register(@Body() dto: CreateUserDto){
        const user = new RegisterNewUser(dto);
        return await user.register();
    }
}