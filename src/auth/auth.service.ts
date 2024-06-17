/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateStudentDto } from 'src/students/dto/createStudent.dto';
import * as bcrypt from 'bcrypt';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginStudentDto } from 'src/students/dto/loginStudent.dto';
import { CreateTeacherDto } from 'src/teachers/dto/createTeacher.dto';
import { LoginTeacherDto } from 'src/teachers/dto/loginTeacher.dto';
import { Admin } from 'src/admin/entities/admin';
import { CreateAdminDto } from 'src/admin/dto/createAdmin.dto';
import { LoginAdminDto } from 'src/admin/dto/loginAdmin.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Teacher)
        private teacherRepository: Repository<Teacher>,

        @InjectRepository(Student)
        private studentRepository: Repository<Student>,
        @InjectRepository(Admin)
        private adminRepository: Repository<Admin>,

        private jwtService: JwtService,
        // private readonly uploadservice: UploadService,
    ) { }
    private async generateToken(user: any) {
        const payload = { username: user.username, sub: user.email };
        return {
            data: user,
            access_token: this.jwtService.sign(payload),

        };
    }

    async studentSignUp(createstudentdto: CreateStudentDto) {
        const existingUser = await this.studentRepository.findOneBy({
            email: createstudentdto.email,
        });
        if (existingUser) {
            throw new HttpException(
                'Email Already taken.',
                HttpStatus.BAD_REQUEST,
            );
        }
        const hashedPassword = await bcrypt.hash(createstudentdto.password, 10);
        const user = this.studentRepository.create({
            ...createstudentdto,
            password: hashedPassword,
            created_at: new Date(Date.now()),
            updated_at: new Date(Date.now()),
        });
        this.studentRepository.save(user);
        return this.generateToken(user);
    }

    async studentLogin(loginstudentdto: LoginStudentDto) {
        const user = await this.studentRepository.findOneBy({
            email: loginstudentdto.email
        });
        if (!user) {
            throw new UnauthorizedException("Enter Valid Credentials")
        }
        const isMatch = await bcrypt.compare(loginstudentdto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException("Invalid Password")
        }
        return this.generateToken(user);
    }

    async teacherSignUp(createteacherdto: CreateTeacherDto) {
        const existingUser = await this.teacherRepository.findOneBy({
            email: createteacherdto.email,
        });
        if (existingUser) {
            throw new HttpException(
                'Email Already taken.',
                HttpStatus.BAD_REQUEST,
            );
        }
        const hashedPassword = await bcrypt.hash(createteacherdto.password, 10);
        // let profilePictureUrl: string;
        // if (file) {
        //     profilePictureUrl = await this.uploadservice.uploadImage(file);
        // }
        const user = this.teacherRepository.create({
            ...createteacherdto,
            password: hashedPassword,
            // image: profilePictureUrl || null,
            created_at: new Date(Date.now()),
            updated_at: new Date(Date.now()),
        });
        this.teacherRepository.save(user);
        return this.generateToken(user);
    }
    async teacherLogin(loginteacherdto: LoginTeacherDto) {
        const user = await this.teacherRepository.findOneBy({
            email: loginteacherdto.email
        });
        if (!user) {
            throw new UnauthorizedException("Enter Valid Credentials")
        }
        const isMatch = await bcrypt.compare(loginteacherdto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException("Invalid Password")
        }
        return this.generateToken(user);
    }
    async adminSignUp(createadmindto: CreateAdminDto) {
        const existingUser = await this.adminRepository.findOneBy({
            email: createadmindto.email,
        });
        if (existingUser) {
            throw new HttpException(
                'Email Already taken.',
                HttpStatus.BAD_REQUEST,
            );
        }
        const hashedPassword = await bcrypt.hash(createadmindto.password, 10);
        const user = this.adminRepository.create({
            ...createadmindto,
            password: hashedPassword,
            created_at: new Date(Date.now()),
            updated_at: new Date(Date.now()),
        });
        this.adminRepository.save(user);
        return this.generateToken(user);
    }
    async adminLogin(loginadmindto: LoginAdminDto) {
        const user = await this.adminRepository.findOneBy({
            email: loginadmindto.email
        });
        if (!user) {
            throw new UnauthorizedException("Enter Valid Credentials")
        }
        const isMatch = await bcrypt.compare(loginadmindto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException("Invalid Password")
        }
        return this.generateToken(user);
    }
}

