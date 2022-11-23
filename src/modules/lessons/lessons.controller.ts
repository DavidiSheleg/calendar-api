import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Req,
    Res,
    UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import PermissionGuard from '../auth/guards/premission.guard';
import { LessonDTO } from './dto/lesson';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
    constructor(
        private lessonService: LessonsService
    ) { }


    @Get(':userId/:date')
    @UseGuards(PermissionGuard())
    async getUserLessons(@Param('userId', ParseIntPipe) id: number, @Param('date') date: string) {
        try {
            return await this.lessonService.getUserLessons(id, date);
        }
        catch (err) {
            throw new BadRequestException('Get lessons faild', err);
        }
    }


    @UseGuards(JwtAuthGuard)
    @Post('create')
    async createUserLesson(@Body() createLessonDTO: LessonDTO, @Req() req: any) {
        try {
            return await this.lessonService.createLesson(createLessonDTO, req?.user.id);
        }
        catch (err) {
            throw new BadRequestException('Lesson creation faild', err);
        }
    }


    @UseGuards(JwtAuthGuard)
    @Put('update')
    async updateLesson(@Body() updatedLessonDetails: LessonDTO, @Req() req: any): Promise<LessonDTO> {
        try {
           const updatedLesson = await this.lessonService.updateLesson(updatedLessonDetails, req?.user.id);
           const { id, lesson_name, start_date, end_date, color } = updatedLesson;
           return {
               id,
               title: lesson_name,
               start: start_date,
               end: end_date,
               color
           }
        }
        catch (err) {
            throw new BadRequestException('Update lesson faild');
        }
    }


    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteLesson(@Param('id') id: number, @Res() res: any, @Req() req: any) {
        try {
            const IfDeleted = await this.lessonService.deleteLesson(id, req.user.id);

            if (!IfDeleted)
                throw new Error();

            res.status(HttpStatus.OK).send();
        }
        catch (err) {
            throw new BadRequestException('Delete lesson faild');
        }
    }

}
