/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Injectable,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateStudentDto } from 'src/students/dto/createStudent.dto';
import { LoginStudentDto } from 'src/students/dto/loginStudent.dto';
import { CreateTeacherDto } from 'src/teachers/dto/createTeacher.dto';
import { LoginTeacherDto } from 'src/teachers/dto/loginTeacher.dto';
import { CreateAdminDto } from 'src/admin/dto/createAdmin.dto';
import { LoginAdminDto } from 'src/admin/dto/loginAdmin.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { VerifyOtpDto } from 'src/otp/dto/verifyOtp.dto';

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('studentsignup')
  @UseInterceptors(FileInterceptor('image'))
  async createStudent(
    @Body() createstudentdto: CreateStudentDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const user = this.authService.studentSignUp(createstudentdto, image);
    HttpCode(HttpStatus.CREATED);
    return user;
  }
  @UseGuards(JwtAuthGuard)
  @Post('studentlogin')
  async loginStudent(@Body() loginStudentdto: LoginStudentDto) {
    const user = this.authService.studentLogin(loginStudentdto);
    HttpCode(HttpStatus.OK);
    return user;
  }

  @Post('teachersignup')
  @UseInterceptors(FileInterceptor('image'))
  async createTeacher(
    @Body() createteacherdto: CreateTeacherDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const user = this.authService.teacherSignUp(createteacherdto, image);
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
  @UseInterceptors(FileInterceptor('image'))
  async createAdmin(
    @Body() createadmindto: CreateAdminDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const user = this.authService.adminSignUp(createadmindto, image);
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

  @UseGuards(JwtAuthGuard)
  @Post('protected')
  getProtectedRoute(@Request() req) {
    return { message: 'This is a protected route', user: req.user };
  }
}
