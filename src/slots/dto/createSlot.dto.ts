/* eslint-disable prettier/prettier */
import { IsDateString } from '@nestjs/class-validator';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateSlotDto {
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsNotEmpty({ message: 'start time is required' })
  start_time: string;

  @IsString()
  @IsNotEmpty({ message: 'duration is required' })
  duration: string;

  @IsBoolean()
  available: boolean = true;

  @IsNotEmpty({ message: "teacher id is required who own's this slot" })
  teacher_id: string;
}
