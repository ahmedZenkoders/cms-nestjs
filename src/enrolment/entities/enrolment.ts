/* eslint-disable prettier/prettier */
import { Course } from 'src/courses/entities/course';
import { EnrolmentStatus } from 'src/enum/enrolment.enum';
import { Student } from 'src/students/entities/student';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Enrolment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'enum',
    enum: EnrolmentStatus,
    default: EnrolmentStatus.active,
  })
  status: EnrolmentStatus;
  @Column({ type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(() => Course, (course) => course.enrolments)
  @JoinColumn({ name: 'course_code' })
  course_code: Course;

  @ManyToOne(() => Student, (student) => student.enrolments)
  @JoinColumn({ name: 'student_id' })
  student_id: Student;
}
