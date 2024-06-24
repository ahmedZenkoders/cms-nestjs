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
import { InjectRepository } from '@nestjs/typeorm';
import { CourseService } from 'src/courses/courses.service';
import { CreateCourseDto } from 'src/courses/dto/createCourse.dto';
import { UpdateCourseDto } from 'src/courses/dto/updateCourse.dto';
import { Roles } from 'src/decorator/role.decorator';
import { EnrolmentService } from 'src/enrolment/enrolment.service';
import { Role } from 'src/enum/role.enum';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Teacher } from './entities/teacher';
import { Repository } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateTeacherDto } from './dto/updateTeacher.dto';
import { TeachersService } from './teachers.service';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('teacher')
export class TeachersController {
  constructor(
    private readonly enrolmentsService: EnrolmentService,
    private readonly courseService: CourseService,
    private readonly teacherService: TeachersService,
  ) { }

  @Roles(Role.teacher)
  @Patch('/updateprofilepicture/:email')
  @UseInterceptors(FileInterceptor('image'))
  async updateTeacherProfilePicture(
    @Param('email') email: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updatedImageUrl =
      await this.teacherService.updateTeacherProfilePicture(email, file);
    return {
      message: 'Teacher profile picture updated successfully',
      imageUrl: updatedImageUrl,
    }
  }


  @Roles(Role.teacher)
  @Patch('/updateProfile/:email')
  UpdateProfile(
    @Param('email') email: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    return this.teacherService.updateTeacherProfile(email, updateTeacherDto);
  }


  @Roles(Role.teacher)
  @Get('/viewProfile/:email')
  async ViewProfile(@Param('email') email: string) {
    return await this.teacherService.ViewProfileDetails(email);
  }

  
  @Roles(Role.teacher)
  @Get('/viewCourses')
  async ViewAllCourses() {
    return await this.courseService.getAllCourses();
  }


  @HttpCode(HttpStatus.OK)
  @Roles(Role.teacher)
  @Get('/teachersEnrolment')
  async getEnrolmentsbyEmail(@Body('email') email: string) {
    return await this.enrolmentsService.GetAllEnrolmentsWithTeacher(email);
  }

  @Roles(Role.teacher)
  @Post('/addCourse')
  async Create(@Body() createCourseDto: CreateCourseDto) {
    return await this.courseService.addCourse(createCourseDto);
  }

  @Roles(Role.teacher)
  @Patch('/updateCourse/:id')
  async Update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return await this.courseService.updateCourse(id, updateCourseDto);
  }

  @Roles(Role.teacher)
  @Delete('/deleteCourse/:id')
  async delete(@Param('id') id: string, @Body() email: string) {
    return await this.courseService.removeCourse(id, email);
  }
}
