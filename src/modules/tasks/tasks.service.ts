import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { Task } from 'src/entities/task.entity';
import { Repository } from 'typeorm';
import { TaskDTO } from './dto/task';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task) private taskRepository: Repository<Task>,
    ) { }


    async getUserTasks(userId: number, date: string): Promise<TaskDTO[]> {
        const tasks = await this.taskRepository
            .query(`
             SELECT *
             FROM tasks
             WHERE WEEK(date) = WEEK(?) 
             AND user_id = ?
             AND deleted_at IS NULL
             ORDER BY date
            `, [date, userId]);

        const DTO_tasks = tasks.map(({ id, task_name, date, done }) => {
            const formarDate = format(date, 'yyyy-MM-dd');
            return (
                {
                    id,
                    task_name,
                    date: formarDate,
                    done
                })
        });

        return DTO_tasks;
    }


    async createTask(newTaskDetails: TaskDTO, user_id: number): Promise<TaskDTO> {
        const { task_name, date, done } = newTaskDetails;

        const newTask = new Task();
        newTask.task_name = task_name;
        newTask.date = date;
        newTask.created_at = new Date();
        newTask.done = done;
        newTask.user_id = user_id;

        const task = await this.taskRepository.save(newTask);
        return {
            id: task.id,
            task_name: task.task_name,
            date: task.date,
            done: task.done
        }
    }

    async updateTask(updatedTaskDetails: TaskDTO, user_id: number): Promise<Task> {
        const taskToUpdate = await this.taskRepository.findOneBy({
            id: updatedTaskDetails.id,
            user_id
        });

        const { task_name, date, done } = updatedTaskDetails;
        taskToUpdate.task_name = task_name;
        taskToUpdate.date = date;
        taskToUpdate.done = done;

        return this.taskRepository.save(taskToUpdate);
    }

    async deleteTask(id: number, user_id: number): Promise<boolean> {
        const taskToDelete = await this.taskRepository.findOneBy({
            id,
            user_id
        });

        if (!taskToDelete)
            return false;

        await this.taskRepository.softDelete(id);
        return true;
    }
}
