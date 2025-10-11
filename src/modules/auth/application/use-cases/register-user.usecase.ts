import {CreateUserDto} from "@/modules/auth/presentation/dtos/user.dto";
import {RegisterUserPort} from "@/modules/auth/application/ports/register-user.port";
import {Inject} from "@nestjs/common";
import {USER_REPOSITORY} from "@/modules/user/application/user.port";
import {UsersRepository} from "@/modules/user/infrastructure/user.repository";

export class RegisterNewUser implements RegisterUserPort {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UsersRepository
    ) {}
    async register(user: CreateUserDto) {
        // TODO: check if user already exists

        // TODO: hash password

        const data = await this.userRepository.createUser(user);
        return {
            user: data,
            message: "User is successfully registered",
        };
    }
}