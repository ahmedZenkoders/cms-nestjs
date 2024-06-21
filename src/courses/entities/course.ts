/* eslint-disable prettier/prettier */
import { Enrolment } from 'src/enrolment/entities/enrolment';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

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

  @OneToMany(() => Enrolment, (enrolment) => enrolment.course)
  enrolments: Enrolment[];
}
