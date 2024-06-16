/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty} from "class-validator";

export class CreateDomainDto {

    @IsNotEmpty({ message: 'Name is required' })
    @IsString()
    name: string;

}