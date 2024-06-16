import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Domain {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}