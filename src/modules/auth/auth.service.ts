import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';
import { User } from 'src/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDTO } from './dto/login';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, pass: string): Promise<User | null> {
        const user = await this.usersService.findUser(email);
        const hashPass = createHash('sha256').update(pass).digest('hex');

        if (user && user.password === hashPass)
            return user;

        return null;
    }

    async login(user: LoginDTO) {
        const userFromDB = await this.usersService.findUser(user.email);
        const payload = { email: user.email, id: userFromDB.id };

        return {
            id: userFromDB.id,
            access_token: this.jwtService.sign(payload)
        }
    }

}
