/* eslint-disable prettier/prettier */
import { Enrolment } from 'src/enrolment/entities/enrolment';
import { Teacher } from 'src/teachers/entities/teacher';
import { Entity, PrimaryColumn, Column, OneToMany,ManyToOne ,JoinColumn} from 'typeorm';

@Entity({ name: 'students' })
export class Student {
  @PrimaryColumn()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column()
  contact: string;

  @Column()
  age: number;

  @Column({ nullable: true })
  img: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @Column({ default: 'false' })
  is_suspended: boolean;

  @Column({ default: 'false' })
  is_verified: boolean;

  @Column({ default: 'student' })
  role: string;
  
  @OneToMany(() => Enrolment, (enrolment) => enrolment.course_code)
  enrolments: Enrolment;

  @ManyToOne(() => Teacher, (teacher) => teacher.courses)
  @JoinColumn({ name: 'teacher_id' })
  teacher_id: Teacher;
}


