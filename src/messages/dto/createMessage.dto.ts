/* eslint-disable prettier/prettier */
import { IsEmail, IsInt } from '@nestjs/class-validator';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty({ message: 'Cannot send empty message' })
  @IsString()
  content: string;

  @IsOptional()
  @IsEmail()
  senderStudentId?: string;

  @IsOptional()
  @IsEmail()
  senderTeacherId?: string;

  @IsOptional()
  @IsEmail()
  receiverStudentId?: string;

  @IsOptional()
  @IsEmail()
  receiverTeacherId?: string;

  @IsNotEmpty()
  @IsInt()
  chatId: number;
}
