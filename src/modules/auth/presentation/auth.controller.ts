import {Body, Controller, Get, Inject, Post, Req, Res, UnauthorizedException} from "@nestjs/common";
import {CreateUserDto, LoginUserDto} from "@/modules/auth/presentation/dtos/user.dto";
import {
    REGISTER_USER_PORT,
    LOGIN_USER_PORT,
    REFRESH_TOKEN_PORT,
} from "@/modules/auth/application/ports/user.port";
import type {RegisterUserPort, LoginUserPort, RefreshTokenPort} from "@/modules/auth/application/ports/user.port";
import type {Response, Request} from "express";


@Controller('auth')

export class AuthController {
    constructor(
        @Inject(REGISTER_USER_PORT)
        private readonly registerUserUseCase: RegisterUserPort,
        @Inject(LOGIN_USER_PORT)
        private readonly loginUserUseCase: LoginUserPort,
        @Inject(REFRESH_TOKEN_PORT)
        private readonly refreshTokenUseCase: RefreshTokenPort
    ){}

    @Post('register')
    async register(@Body() dto: CreateUserDto){
        return await this.registerUserUseCase.register(dto);
    }
    @Post('login')
    async login(@Body() dto: LoginUserDto,@Res({ passthrough: true }) response: Response){
        const { accessToken, refreshToken, user } =  await this.loginUserUseCase.login(dto);

        // Set HttpOnly cookie for the refresh token
        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.ENV === 'production',
            sameSite: 'strict',
        });

        return {
            accessToken,
            user
        };
    }

    @Get('refresh')
    async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const token = request.cookies['refreshToken'];
        if (!token) {
            throw new UnauthorizedException('Refresh token not found');
        }

        const { accessToken, refreshToken } =  await this.refreshTokenUseCase.execute(token);

        // Set HttpOnly cookie for the refresh token
        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.ENV === 'production',
            sameSite: 'strict',
        });

        return {
            accessToken
        };

    }

    @Post('logout')
    async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {

        response.clearCookie('refreshToken');

        return { message: 'Logged out successfully' };
    }
}