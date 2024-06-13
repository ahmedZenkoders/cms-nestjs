/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: "students" })
export class Student {
    @PrimaryGeneratedColumn()
    email: string

    @Column()
    userName: string

    @Column()
    password: string

    @Column()
    address: string

    @Column()
    contact: string

    @Column()
    age: number

    @Column({ type: 'timestamptz' })
    created_at: string

    @Column({ type: 'timestamptz' })
    updated_at: string

    @Column()
    is_suspended: boolean

    @Column()
    is_verified: boolean

    @Column({default:"student"})
    role:string
}