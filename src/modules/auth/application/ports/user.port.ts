import {CreateUserDto, LoginUserDto} from "@/modules/auth/presentation/dtos/user.dto";

export const REGISTER_USER_PORT = 'REGISTER_USER_PORT';

export interface RegisterUserPort {
    register(dto: CreateUserDto): Promise<any>;
}

export const LOGIN_USER_PORT = 'LOGIN_USER_PORT';

export interface LoginUserPort {
    login(dto: LoginUserDto): Promise<any>;
}

export const REFRESH_TOKEN_PORT = 'REFRESH_TOKEN_PORT';

export interface RefreshTokenPort {
    execute(token: string): Promise<any>;
}