import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDTO } from '../auth/dto/register';
import { createHash } from 'crypto';
import { UserDTO } from './dto/user';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ) { }

    async createUser(registerDTO: RegisterDTO): Promise<User> {
        const { first_name, last_name, email, password } = registerDTO;

        const hashPass = createHash('sha256').update(password).digest('hex');

        const newUser = new User()
        newUser.first_name = first_name;
        newUser.last_name = last_name;
        newUser.email = email;
        newUser.password = hashPass;
        newUser.created_at = new Date();


        await this.usersRepository.save(newUser);
        return newUser;
    }

    async findUser(email: string): Promise<User | null> {
        const user = this.usersRepository.findOne({
            where: { email }
        });

        return user;
    }

    async getUserById(id: number): Promise<User | null> {
        const user = this.usersRepository.findOne({
            where: { id }
        });

        return user;
    }

    async updateUser(updatedUser: UserDTO, userId: number): Promise<User | string> {
        const userToUpdate = await this.getUserById(userId);
        const { first_name, last_name, email, password } = updatedUser;
        const findUserByEmail = await this.findUser(email);

        if (findUserByEmail && findUserByEmail?.id !== userId)
            return 'Email already exist';
        
        userToUpdate.first_name = first_name;
        userToUpdate.last_name = last_name;
        userToUpdate.email = email;

        if (password.length > 0) {
            const hashPass = createHash('sha256').update(password).digest('hex');
            userToUpdate.password = hashPass;
        }

        return this.usersRepository.save(userToUpdate);
    }
}
