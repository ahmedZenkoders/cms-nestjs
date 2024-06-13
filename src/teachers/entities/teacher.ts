/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: "teachers" })
export class Teacher {
    @PrimaryGeneratedColumn()
    email: string

    @Column()
    userName: string

    @Column()
    password: string

    @Column()
    address: string

    @Column()
    contact: number

    @Column()
    age: number

    @Column({ type: 'timestamp' })
    created_at: string

    @Column({ type: 'timestamp' })
    updated_at: string

    @Column()
    is_suspended: boolean

    @Column()
    is_verified: boolean

    @Column({default:"teacher"})
    role: string
}