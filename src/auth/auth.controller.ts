/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, HttpStatus, Injectable, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateStudentDto } from 'src/students/dto/createStudent.dto';
import { LoginStudentDto } from 'src/students/dto/loginStudent.dto';
import { CreateTeacherDto } from 'src/teachers/dto/createTeacher';
import { LoginTeacherDto } from 'src/teachers/dto/loginTeacher.dto';
import { CreateAdminDto } from 'src/admin/dto/createAdmin.dto';
import { LoginAdminDto } from 'src/admin/dto/loginAdmin.dto';

@Injectable()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @Post('/studentsignup')
    async createStudent(@Body() createstudentdto: CreateStudentDto ) {
        const user=this.authService.studentSignUp(createstudentdto)
        HttpCode(HttpStatus.CREATED);
        return user
    }

    @Post('/studentlogin')
    async loginStudent(@Body() loginStudentdto:LoginStudentDto){
        const user=this.authService.studentLogin(loginStudentdto)
        HttpCode(HttpStatus.OK);
        return user
    }
    @Post('/teachersignup')
    async createTeacher(@Body() createteacherdto: CreateTeacherDto) {
        const user = this.authService.teacherSignUp(createteacherdto)
        HttpCode(HttpStatus.CREATED);
        return user
    }
    @Post('/teacherlogin')
    async loginTeacher(@Body() loginteacherdto: LoginTeacherDto) {
        const user = this.authService.teacherLogin(loginteacherdto)
        HttpCode(HttpStatus.OK);
        return user
    }
    @Post('/adminsignup')
    async createAdmin(@Body() createadmindto: CreateAdminDto) {
        const user = this.authService.adminSignUp(createadmindto)
        HttpCode(HttpStatus.CREATED);
        return user
    }
    @Post('/adminlogin')
    async loginAdmin(@Body() loginadmindto: LoginAdminDto) {
        const user = this.authService.adminLogin(loginadmindto)
        HttpCode(HttpStatus.OK);
        return user
    }
}
