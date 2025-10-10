import { IsEmail, IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    name: string;
}
