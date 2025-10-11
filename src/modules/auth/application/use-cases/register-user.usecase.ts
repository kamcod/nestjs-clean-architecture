import {CreateUserDto} from "@/modules/auth/presentation/dtos/user.dto";
import {RegisterUserPort} from "@/modules/auth/application/ports/register-user.port";
import {ConflictException, Inject} from "@nestjs/common";
import {USER_REPOSITORY} from "@/modules/user/application/user.port";
import {UsersRepository} from "@/modules/user/infrastructure/user.repository";
import {BcryptService} from "@/modules/auth/infrastructure/bcrypt.service";
import {BCRYPT_SERVICE} from "@/modules/auth/application/ports/bcrypt.port";

export class RegisterNewUser implements RegisterUserPort {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UsersRepository,
        @Inject(BCRYPT_SERVICE)
        private readonly bcrypt: BcryptService
    ) {}
    async register(user: CreateUserDto) {
        // 1. Check if user exists using the port
        const existingUser = await this.userRepository.findByEmail(user.email);
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword = await this.bcrypt.hash(user.password);

        const data = await this.userRepository.createUser({
            ...user,
            password: hashedPassword
        });
        return {
            user: data,
            message: "User is successfully registered",
        };
    }
}