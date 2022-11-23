import { Body, Controller, HttpException, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login';
import { RegisterDTO } from './dto/register';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) { }


    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() loginDTO: LoginDTO) {
        return this.authService.login(loginDTO);
    }

    @Post('register')
    async register(@Body() registerDTO: RegisterDTO) {
        const user = await this.usersService.findUser(registerDTO.email);

        if (user)
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'Email is already exist'
            }, HttpStatus.FORBIDDEN);

        await this.usersService.createUser(registerDTO);

        return this.authService.login({ email: registerDTO.email, password: registerDTO.password });
    }


}
