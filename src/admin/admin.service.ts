import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateStudentDto } from 'src/students/dto/updateStudent.dto';
import { Student } from 'src/students/entities/student';
import { UpdateTeacherDto } from 'src/teachers/dto/updateTeacher.dto';
import { Teacher } from 'src/teachers/entities/teacher';
import { Repository } from 'typeorm'
@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Student) private studentRepository: Repository<Student>,
        @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
    ) { }
    async SuspendStudent(email: string) {
        const student = await this.studentRepository.findOneBy({ email:email })
        if (!student) {
            throw new BadRequestException("Student doesn't exist")
        }
        const suspended_student = await this.studentRepository.update(
            { email: email },
            { is_suspended: true },
        );
        return {
            message: "Student suspended successfully",
            SuspendedStudent: suspended_student
        }
    }
    async SuspendTeacher(email: string) {
        const teacher = await this.teacherRepository.findOneBy({ email: email })
        if (!teacher) {
            throw new BadRequestException("Teacher doesn't exist")
        }
        const suspended_teacher = await this.teacherRepository.update(
            { email: email },
            { is_suspended: true },
        );
        return {
            message: "Teacher suspended successfully",
            SuspendedTeacher: suspended_teacher
        }
    }
}
