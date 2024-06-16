/* eslint-disable prettier/prettier */
import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity({ name: "students" })
export class Student {
    @PrimaryColumn()
    coursecode: string

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    type: string

    @Column({ type: 'timestamp' })
    created_at: Date

    @Column({ type: 'timestamp' })
    updated_at: Date
}