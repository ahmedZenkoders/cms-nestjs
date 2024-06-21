/* eslint-disable prettier/prettier */
import { Course } from 'src/courses/entities/course';
import { Student } from 'src/students/entities/student';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'enrolment' })
export class Enrolment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  enrolment_date: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => Course, (course) => course.enrolments)
  course: Course;

  @ManyToOne(() => Student, (student) => student.enrolments)
  student: Student;
}
