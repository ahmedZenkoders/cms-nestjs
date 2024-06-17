/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, HttpStatus, Injectable, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateStudentDto } from 'src/students/dto/createStudent.dto';
import { LoginStudentDto } from 'src/students/dto/loginStudent.dto';
import { CreateTeacherDto } from 'src/teachers/dto/createTeacher.dto';
import { LoginTeacherDto } from 'src/teachers/dto/loginTeacher.dto';
import { CreateAdminDto } from 'src/admin/dto/createAdmin.dto';
import { LoginAdminDto } from 'src/admin/dto/loginAdmin.dto';
import { EmailDomainGuard } from 'src/guards/email.guard';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Injectable()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @UseGuards(EmailDomainGuard)
    @Post('studentsignup')
    async createStudent(@Body() createstudentdto: CreateStudentDto) {
        const user = this.authService.studentSignUp(createstudentdto)
        HttpCode(HttpStatus.CREATED);
        return user
    }

    @Post('studentlogin')
    async loginStudent(@Body() loginStudentdto: LoginStudentDto) {
        const user = this.authService.studentLogin(loginStudentdto)
        HttpCode(HttpStatus.OK);
        return user
    }


    @UseGuards(EmailDomainGuard)
    // @UseInterceptors(FileInterceptor('profilePicture'))
    @Post('teachersignup')
    async createTeacher(@Body() createteacherdto: CreateTeacherDto) {
        const user = this.authService.teacherSignUp(createteacherdto);
        HttpCode(HttpStatus.CREATED);
        return user
    }


    @Post('teacherlogin')
    async loginTeacher(@Body() loginteacherdto: LoginTeacherDto) {
        const user = this.authService.teacherLogin(loginteacherdto)
        HttpCode(HttpStatus.OK);
        return user
    }
    @UseGuards(EmailDomainGuard)
    @Post('adminsignup')
    async createAdmin(@Body() createadmindto: CreateAdminDto) {
        const user = this.authService.adminSignUp(createadmindto)
        HttpCode(HttpStatus.CREATED);
        return user
    }
    @Post('adminlogin')
    async loginAdmin(@Body() loginadmindto: LoginAdminDto) {
        const user = this.authService.adminLogin(loginadmindto)
        HttpCode(HttpStatus.OK);
        return user
    }
    @UseGuards(JwtAuthGuard)
    @Post('protected')
    getProtectedRoute(@Request() req) {
      return { message: 'This is a protected route', user: req.user };
    }
}
