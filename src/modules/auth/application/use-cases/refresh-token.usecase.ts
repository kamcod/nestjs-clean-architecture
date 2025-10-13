import {RefreshTokenPort} from "@/modules/auth/application/ports/user.port";
import {Inject, UnauthorizedException} from "@nestjs/common";
import {USER_REPOSITORY} from "@/modules/user/application/user.port";
import {UsersRepository} from "@/modules/user/infrastructure/user.repository";
import {JwtService} from "@nestjs/jwt";

export class RefreshToken implements RefreshTokenPort {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UsersRepository,
        private readonly jwtService: JwtService
    ) {}
    async execute(token: string) {

        try {
            const payload = this.jwtService.verify(token);
            const user = await this.userRepository.findByID(payload.sub);

            if (!user) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const accessToken = this.jwtService.sign({ sub: user.id, email: user.email }, { expiresIn: '15m' });
            const refreshToken = this.jwtService.sign({ sub: user.id, email: user.email }, { expiresIn: '7d' });


            return { accessToken, refreshToken };
        } catch (e) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }
}