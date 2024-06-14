/* eslint-disable prettier/prettier */
import { IsNotEmpty,  IsNumber,  IsString} from "class-validator";

export class CreateAdminDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    @IsString()
    domain:string;
}