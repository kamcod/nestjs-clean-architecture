import {CreateUserDto} from "@/modules/auth/presentation/dtos/user.dto";
import {RegisterUserPort} from "@/modules/auth/application/ports/register-user.port";

export class RegisterNewUser implements RegisterUserPort {
    constructor(
    ) {}
    async register(user: CreateUserDto) {
        // TODO: check if user already exists

        // TODO: hash password

        // TODO: create new user in DB
        console.log('her... ', user);
        return {
            message: "basic validation and create user"
        };
    }
}