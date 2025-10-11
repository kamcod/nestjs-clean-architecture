// This is your PORT (abstraction)
import { User } from "@/modules/user/domain/user.entity";

export const USER_REPOSITORY = 'USER_REPOSITORY'; // Injection token

export interface UserRepository {
    createUser(userData: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
}