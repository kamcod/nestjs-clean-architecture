import {CreateUserDto} from "@/modules/auth/presentation/dtos/user.dto";

export class RegisterNewUser{
    constructor(
        user: CreateUserDto,
    ) {}
    async register() {
        // TODO: check if user already exists

        // TODO: hash password

        // TODO: create new user in DB
        return {};
    }
}