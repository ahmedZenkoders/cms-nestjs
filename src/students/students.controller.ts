/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorator/role.decorator';
import { CreateEnrolmentDto } from 'src/enrolment/dto/createEnrolment.dto';
import { RemoveCourseDto } from 'src/enrolment/dto/removeCourse.dto';
import { EnrolmentService } from 'src/enrolment/enrolment.service';
import { Role } from 'src/enum/role.enum';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { StudentsService } from './students.service';
import { UpdateStudentDto } from './dto/updateStudent.dto';
import { CourseService } from 'src/courses/courses.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { CreateAppointmentDto } from 'src/appointments/dto/createAppointment.dto';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('student')
export class StudentsController {
  constructor(
    private readonly enrolmentService: EnrolmentService,
    private readonly studentService: StudentsService,
    private readonly courseService: CourseService,
    private readonly appointmentService: AppointmentsService,
  ) {}
  @Roles(Role.student)
  @Post('/addEnrolment')
  async Create(@Body() createEnrolmentDto: CreateEnrolmentDto) {
    return this.enrolmentService.CreateEnrolment(createEnrolmentDto);
  }
  @Roles(Role.student)
  @Delete('/dropCourse')
  async Drop(@Body() removeCourseDto: RemoveCourseDto) {
    HttpCode(HttpStatus.OK);
    return this.enrolmentService.RemoveCourse(removeCourseDto);
  }
  @Roles(Role.student)
  @Get('/getEnrolmentsbyEmail')
  async Get(@Body('email') email: string) {
    HttpCode(HttpStatus.OK);
    return this.enrolmentService.GetAllEnrolments(email);
  }
  @Roles(Role.student)
  @Patch('/updateprofilepicture/:email')
  @UseInterceptors(FileInterceptor('image'))
  async updateStudentProfilePicture(
    @Param('email') email: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updatedImageUrl =
      await this.studentService.updateStudentProfilePicture(email, file);
    return {
      message: 'Student profile picture updated successfully',
      imageUrl: updatedImageUrl,
    };
  }
  @Roles(Role.student)
  @Patch('/updateProfile/:email')
  UpdateProfile(
    @Param('email') email: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.updateStudentProfile(email, updateStudentDto);
  }
  @Roles(Role.student)
  @Get('/viewProfile/:email')
  async ViewProfile(@Param('email') email: string) {
    return await this.studentService.ViewProfileDetails(email);
  }
  @Roles(Role.student)
  @Get('/viewCourses')
  async ViewAllCourses() {
    return await this.courseService.getAllCourses();
  }

  @Post('/createAppointment')
  async CreateAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    return await this.appointmentService.createAppointment(
      createAppointmentDto,
    );
  }

  @Get('getMyAppointments/:email')
  async getAppointmentsByEmail(@Param('email') email: string) {
    const appointments =
      await this.appointmentService.getAppointmentsByStudent(email);
    return appointments;
  }
}
