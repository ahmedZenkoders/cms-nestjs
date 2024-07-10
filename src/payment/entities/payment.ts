/* eslint-disable prettier/prettier */
import { Course } from 'src/courses/entities/course';
import { PaymentStatus } from 'src/enum/payment.enum';
import { Student } from 'src/students/entities/student';
import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  time: Date;
  @Column()
  paymentIntentId: string;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.Pending,
  })
  status: PaymentStatus;

  @ManyToOne(() => Student, (student) => student.payment_id)
  @JoinColumn({ name: 'student_id' })
  student_id: Student;

  @ManyToOne(() => Course, (course) => course.payment_id)
  @JoinColumn({ name: 'course_code' })
  course_code: Course;
}
