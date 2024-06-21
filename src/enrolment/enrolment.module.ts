/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EnrolmentService } from './enrolment.service';
import { EnrolmentController } from './enrolment.controller';
@Module({
  providers: [EnrolmentService],
  controllers: [EnrolmentController],
})
export class EnrolmentModule {}
