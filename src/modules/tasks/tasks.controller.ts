import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import PermissionGuard from '../auth/guards/premission.guard';
import { TaskDTO } from './dto/task';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(
        private tasksService: TasksService
    ) { }

    @Get(':userId/:date')
    @UseGuards(PermissionGuard())
    async getUserTasks(@Param('userId', ParseIntPipe) id: number, @Param('date') date: string) {
        try {
            return await this.tasksService.getUserTasks(id, date);
        }
        catch (err) {
            throw new BadRequestException('Get tasks faild', err);
        }
    }


    @UseGuards(JwtAuthGuard)
    @Post('create')
    async createUserTask(@Body() createTaskDTO: TaskDTO, @Req() req: any) {
        try {
            return await this.tasksService.createTask(createTaskDTO, req?.user.id);
        }
        catch (err) {
            throw new BadRequestException('Task creation faild', err);
        }
    }


    @UseGuards(JwtAuthGuard)
    @Put('update')
    async updateTask(@Body() updatedTaskDetails: TaskDTO, @Req() req: any): Promise<TaskDTO> {
        try {
           const updatedTask = await this.tasksService.updateTask(updatedTaskDetails, req?.user.id);
           const { id, task_name, date, done } = updatedTask;
           return {
               id,
               task_name,
               date,
               done
           }
        }
        catch (err) {
            throw new BadRequestException('Update task faild');
        }
    }


    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteTask(@Param('id') id: number, @Res() res: any, @Req() req: any) {
        try {
            const IfDeleted = await this.tasksService.deleteTask(id, req.user.id);

            if (!IfDeleted)
                throw new Error();

            res.status(HttpStatus.OK).send();
        }
        catch (err) {
            throw new BadRequestException('Delete task faild');
        }
    }
}
