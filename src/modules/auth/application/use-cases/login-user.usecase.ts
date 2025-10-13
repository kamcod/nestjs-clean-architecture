import {LoginUserDto} from "@/modules/auth/presentation/dtos/user.dto";
import {LoginUserPort} from "@/modules/auth/application/ports/user.port";
import {ConflictException, Inject, UnauthorizedException} from "@nestjs/common";
import {USER_REPOSITORY} from "@/modules/user/application/user.port";
import {UsersRepository} from "@/modules/user/infrastructure/user.repository";
import {BcryptService} from "@/modules/auth/infrastructure/bcrypt.service";
import {BCRYPT_SERVICE} from "@/modules/auth/application/ports/bcrypt.port";
import {JwtService} from "@nestjs/jwt";

export class LoginUser implements LoginUserPort {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UsersRepository,
        @Inject(BCRYPT_SERVICE)
        private readonly bcrypt: BcryptService,
        private readonly jwtService: JwtService
    ) {}
    async login(user: LoginUserDto) {
        const existingUser = await this.userRepository.findByEmail(user.email);
        if (!existingUser) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const isPasswordValid = await this.bcrypt.compare(user.password, existingUser.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const payload = { sub: existingUser.id, email: existingUser.email };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                id: existingUser.id,
                email: existingUser.email,
                name: existingUser.name
            }
        };
    }
}