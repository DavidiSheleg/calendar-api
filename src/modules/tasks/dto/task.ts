import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty } from "class-validator";

export class TaskDTO {

    id?: number;

    @IsNotEmpty()
    task_name: string;

    @Transform( ({ value }) => new Date(value))
    @IsDate()
    date: Date;

    @IsBoolean()
    done: boolean;
  }