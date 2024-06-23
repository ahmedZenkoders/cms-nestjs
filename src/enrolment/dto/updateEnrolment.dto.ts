import { PartialType } from '@nestjs/mapped-types';
import { CreateEnrolmentDto } from './createEnrolment.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EnrolmentStatus } from 'src/enum/enrolment.enum';

export class UpdateCourseDto extends PartialType(CreateEnrolmentDto) {
    @IsEnum(EnrolmentStatus)
    @IsOptional()
    status?: EnrolmentStatus;
}