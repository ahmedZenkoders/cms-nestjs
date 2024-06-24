/* eslint-disable prettier/prettier */
import { Enrolment } from 'src/enrolment/entities/enrolment';
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

  @Column()
  type: string;

  @Column()
  deadline: Date;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => Enrolment, (enrolment) => enrolment.course_code)
  enrolments: Enrolment;

  @ManyToOne(() => Teacher, (teacher) => teacher.courses)
  @JoinColumn({ name: 'teacher_id' })
  teacher_id: Teacher;
}
