import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { async } from 'rxjs';
import { CreateStudentDto } from 'src/students/dto/createStudent.dto';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Student)
        private StudentRepository: Repository<Student>,

        @InjectRepository(Teacher)
        private TeacherRepository: Repository<Teacher>
    ) {}
 }


    async studentSignUp(createstudentdto : CreateStudentDto){
    const existingUser = await this.StudentRepository.findOneBy({ email: createstudentdto.email })
    if (existingUser) {
        throw new HttpException("Student with this email already exists.", HttpStatus.BAD_REQUEST)
    }
    const user = this.StudentRepository.create({ ...createstudentdto, created_at: new Date(Date.now()), updated_at: new Date(Date.now()) });
    this.StudentRepository.save(user)
    return user
}
function InjectRepository(Student: typeof Student): (target: typeof AuthService, propertyKey: undefined, parameterIndex: 0) => void {
    throw new Error('Function not implemented.');
}

function studentSignUp(createstudentdto: any, CreateStudentDto: typeof CreateStudentDto) {
    throw new Error('Function not implemented.');
}

