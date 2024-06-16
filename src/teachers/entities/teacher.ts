/* eslint-disable prettier/prettier */
import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity({ name: "teachers" })
export class Teacher {
    @PrimaryColumn()
    email: string

    @Column()
    username: string

    @Column()
    password: string

    @Column()
    address: string

    @Column()
    contact: string

    @Column()
    age: number

    @Column({ type: 'timestamp' })
    created_at: Date

    @Column({ type: 'timestamp' })
    updated_at: Date

    @Column({default:"false"})
    is_suspended: boolean

    @Column({default:"false"})
    is_verified: boolean

    @Column({default:"teacher"})
    role: string
}