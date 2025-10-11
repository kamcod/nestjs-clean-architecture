import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {BcryptServicePort} from "@/modules/auth/application/ports/bcrypt.port";

@Injectable()
export class BcryptService implements BcryptServicePort {
    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }

    async compare(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed);
    }
}
