export const BCRYPT_SERVICE = 'BCRYPT_SERVICE';

export interface BcryptServicePort {
    hash(password: string): Promise<string>;
    compare(password: string, hashedPassword: string): Promise<boolean>;
}