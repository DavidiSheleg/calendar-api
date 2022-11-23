import { IsEmail, IsNotEmpty } from "class-validator";

export class UserDTO {
    id?: number;

    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    last_name: string;

    @IsEmail()
    email: string;

    password?: string;
  }