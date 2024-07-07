/* eslint-disable prettier/prettier */
import { Enrolment } from 'src/enrolment/entities/enrolment';
import { CourseType } from 'src/enum/course-type.enum';
import { Payment } from 'src/payment/entities/payment';
import { Teacher } from 'src/teachers/entities/teacher';
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'courses' })
export class Course {
  @PrimaryColumn()
  coursecode: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({type:'enum',enum:CourseType,default:CourseType.free})
  type: CourseType;

  @Column()
  deadline: Date;

  @Column({ nullable: true })
  price: number;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => Enrolment, (enrolment) => enrolment.course_code)
  enrolments: Enrolment;

  @ManyToOne(() => Teacher, (teacher) => teacher.courses)
  @JoinColumn({ name: 'teacher_id' })
  teacher_id: Teacher;

  @OneToMany(() => Payment, (payment) => payment.course_code)
  payment_id: Payment;
}
