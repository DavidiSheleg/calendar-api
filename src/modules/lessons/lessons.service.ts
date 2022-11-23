import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { Lesson } from 'src/entities/lesson.entity';
import { Repository } from 'typeorm';
import { LessonDTO } from './dto/lesson';

@Injectable()
export class LessonsService {
    constructor(
        @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
    ) { }


    async getUserLessons(userId: number, date: string): Promise<LessonDTO[]> {
        const lessons = await this.lessonRepository
            .query(`
             SELECT *
             FROM lessons
             WHERE WEEK(start_date) = WEEK(?) 
             AND user_id = ?
             AND deleted_at IS NULL
            `, [date, userId]);

        const DTO_lessons = lessons.map(({ id, lesson_name, start_date, end_date, color }) => {
            const formarStartDate = format(start_date, 'yyyy-MM-dd HH:mm');
            const formarEndtDate = format(end_date, 'yyyy-MM-dd HH:mm');
            return (
                {
                    id,
                    title: lesson_name,
                    start: formarStartDate,
                    end: formarEndtDate,
                    color
                })
        });

        return DTO_lessons;
    }


    async createLesson(newLessonDetails: LessonDTO, user_id: number): Promise<LessonDTO> {
        const { title, start, end, color } = newLessonDetails;

        const newLesson = new Lesson();
        newLesson.lesson_name = title;
        newLesson.start_date = start;
        newLesson.end_date = end;
        newLesson.created_at = new Date();
        newLesson.color = color;
        newLesson.user_id = user_id;

        const lesson = await this.lessonRepository.save(newLesson);
        return {
            id: lesson.id,
            title: lesson.lesson_name,
            start: lesson.start_date,
            end: lesson.end_date,
            color: lesson.color
        }
    }

    async updateLesson(updatedLessonDetails: LessonDTO, user_id: number): Promise<Lesson> {
        const lessonToUpdate = await this.lessonRepository.findOneBy({
            id: updatedLessonDetails.id,
            user_id
        });

        const { title, start, end, color } = updatedLessonDetails;
        lessonToUpdate.lesson_name = title;
        lessonToUpdate.start_date = start;
        lessonToUpdate.end_date = end;
        lessonToUpdate.color = color;

       return this.lessonRepository.save(lessonToUpdate);
    }

    async deleteLesson(id: number, user_id: number): Promise<boolean> {
        const lessonToDelete = await this.lessonRepository.findOneBy({
            id,
            user_id
        });

        if (!lessonToDelete)
            return false;

        await this.lessonRepository.softDelete(id);
        return true;
    }

}
