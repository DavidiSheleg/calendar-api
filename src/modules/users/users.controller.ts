import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import PermissionGuard from '../auth/guards/premission.guard';
import { UserDTO } from './dto/user';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ) { }


    @Get(':userId')
    @UseGuards(PermissionGuard())
    async getUserLessons(@Param('userId', ParseIntPipe) id: number): Promise<UserDTO> {
        try {
            const { email, first_name, last_name } = await this.usersService.getUserById(id);

            return {
                id,
                email,
                first_name,
                last_name
            }
        }
        catch (err) {
            throw new BadRequestException('Find user faild', err);
        }
    }


    @UseGuards(JwtAuthGuard)
    @Put('update')
    async updateUser(@Body() updatedLessonDetails: UserDTO, @Req() req: any): Promise<UserDTO> {

        const updatedUser = await this.usersService.updateUser(updatedLessonDetails, req?.user.id);

        if (typeof updatedUser === 'string') {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: updatedUser
            }, HttpStatus.FORBIDDEN);
        }

        const { id, first_name, last_name, email } = updatedUser;
        return {
            id,
            first_name,
            last_name,
            email
        }
    }
}
