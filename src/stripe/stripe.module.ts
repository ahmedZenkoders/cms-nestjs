/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/courses/entities/course';
import { Enrolment } from 'src/enrolment/entities/enrolment';
import { Payment } from 'src/payment/entities/payment';
import { Student } from 'src/students/entities/student';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';

@Module({
    imports:[TypeOrmModule.forFeature([Payment,Student,Course,Enrolment])],
    controllers:[StripeController],
    providers:[StripeService]
})
export class StripeModule {}
