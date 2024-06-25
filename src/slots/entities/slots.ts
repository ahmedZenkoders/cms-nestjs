/* eslint-disable prettier/prettier */

import { Teacher } from 'src/teachers/entities/teacher';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Slot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  start_time: string;

  @Column()
  duration: string;

  @Column({ default: true })
  available: boolean;

  @ManyToOne(() => Teacher, (teacher) => teacher.slots)
  @JoinColumn({ name: 'teacher_id' })
  teacher_id: Teacher;
}
