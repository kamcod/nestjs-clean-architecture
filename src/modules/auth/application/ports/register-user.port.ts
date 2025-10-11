import { CreateUserDto } from "@/modules/auth/presentation/dtos/user.dto";

export const REGISTER_USER_PORT = 'REGISTER_USER_PORT';

export interface RegisterUserPort {
    register(dto: CreateUserDto): Promise<any>;
}