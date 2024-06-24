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

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.student)
@Controller('student')
export class StudentsController {
  constructor(
    private readonly enrolmentService: EnrolmentService,
    private readonly studentService: StudentsService,
  ) {}
  @Post('/addEnrolment')
  async Create(@Body() createEnrolmentDto: CreateEnrolmentDto) {
    return this.enrolmentService.CreateEnrolment(createEnrolmentDto);
  }

  @Delete('/dropCourse')
  async Drop(@Body() removeCourseDto: RemoveCourseDto) {
    HttpCode(HttpStatus.OK);
    return this.enrolmentService.RemoveCourse(removeCourseDto);
  }

  @Get('/getEnrolmentsbyEmail')
  async Get(@Body('email') email: string) {
    HttpCode(HttpStatus.OK);
    return this.enrolmentService.GetAllEnrolments(email);
  }

  @Patch('/updateprofile/:email')
  @UseInterceptors(FileInterceptor('image'))
  async updateStudentProfilePicture(
    @Param('email') email: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const updatedImageUrl =
        await this.studentService.updateStudentProfilePicture(email, file);
      return {
        message: 'Student profile picture updated successfully',
        imageUrl: updatedImageUrl,
      };
    } catch (error) {
      console.log(error.message);
      throw new Error(
        `Failed to update student profile picture: ${error.message}`,
      );
    }
  }
}
