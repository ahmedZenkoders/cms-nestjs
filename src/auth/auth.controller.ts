/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Injectable,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateStudentDto } from 'src/students/dto/createStudent.dto';
import { LoginStudentDto } from 'src/students/dto/loginStudent.dto';
import { CreateTeacherDto } from 'src/teachers/dto/createTeacher.dto';
import { LoginTeacherDto } from 'src/teachers/dto/loginTeacher.dto';
import { CreateAdminDto } from 'src/admin/dto/createAdmin.dto';
import { LoginAdminDto } from 'src/admin/dto/loginAdmin.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

import { VerifyOtpDto } from 'src/otp/dto/verifyOtp.dto';

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('studentsignup')
  async createStudent(@Body() createstudentdto: CreateStudentDto) {
    const user = this.authService.studentSignUp(createstudentdto);
    HttpCode(HttpStatus.CREATED);
    return user;
  }
  //@UseGuards(JwtAuthGuard)
  @Post('studentlogin')
  async loginStudent(@Body() loginStudentdto: LoginStudentDto) {
    const user = this.authService.studentLogin(loginStudentdto);
    HttpCode(HttpStatus.OK);
    return user;
  }

  @Post('teachersignup')
  async createTeacher(@Body() createteacherdto: CreateTeacherDto) {
    const user = this.authService.teacherSignUp(createteacherdto);
    HttpCode(HttpStatus.CREATED);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('teacherlogin')
  async loginTeacher(@Body() loginteacherdto: LoginTeacherDto) {
    const user = await this.authService.teacherLogin(loginteacherdto);
    HttpCode(HttpStatus.OK);
    return user;
  }

  @Post('adminsignup')
  async createAdmin(@Body() createadmindto: CreateAdminDto) {
    const user = this.authService.adminSignUp(createadmindto);
    HttpCode(HttpStatus.CREATED);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('adminlogin')
  async loginAdmin(@Body() loginadmindto: LoginAdminDto) {
    const user = this.authService.adminLogin(loginadmindto);
    HttpCode(HttpStatus.OK);
    return user;
  }

  @Post('student/verify-otp')
  async verifyStudentOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    try {
      const result = await this.authService.verifyOtp(verifyOtpDto, 'student');
      return { success: true, data: result };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Post('teacher/verify-otp')
  async verifyTeacherOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    try {
      const result = await this.authService.verifyOtp(verifyOtpDto, 'teacher');
      return { success: true, data: result };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Post('admin/verify-otp')
  async verifyAdminOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    try {
      const result = await this.authService.verifyOtp(verifyOtpDto, 'admin');
      return { success: true, data: result };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
