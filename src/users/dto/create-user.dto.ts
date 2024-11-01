import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { GENDER } from "src/common/enums/UserGender";

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    age: number;

    @IsString()
    @IsOptional()
    photo: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEnum(GENDER)
    gender: GENDER
}
