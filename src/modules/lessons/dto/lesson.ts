import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsUUID } from "class-validator";

export class LessonDTO {

    id?: number;

    @IsNotEmpty()
    title: string;

    @Transform( ({ value }) => new Date(value))
    @IsDate()
    start: Date;

    @Transform( ({ value }) => new Date(value))
    @IsDate()
    end: Date;

    @IsNotEmpty()
    color: string;
  }