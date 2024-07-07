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
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { ApproveRejectDto } from 'src/appointments/dto/acceptReject.dto';

import { CourseService } from 'src/courses/courses.service';
import { CreateCourseDto } from 'src/courses/dto/createCourse.dto';
import { UpdateCourseDto } from 'src/courses/dto/updateCourse.dto';
import { Roles } from 'src/decorator/role.decorator';
import { EnrolmentService } from 'src/enrolment/enrolment.service';
import { Role } from 'src/enum/role.enum';
import { CreateSlotDto } from 'src/slots/dto/createSlot.dto';
import { UpdateSlotDto } from 'src/slots/dto/updateSlot.dto';
import { SlotService } from 'src/slots/slots.service';
import { TeachersService } from './teachers.service';
import { UpdateTeacherDto } from './dto/updateTeacher.dto';

@Controller('teacher')
export class TeachersController {
  constructor(
    private enrolmentsService: EnrolmentService,
    private courseService: CourseService,
    private slotService: SlotService,
    private appointmentService: AppointmentsService,
    private teacherService: TeachersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Roles(Role.teacher)
  @Get('/teachersEnrolment')
  async getEnrolmentsbyEmail(@Body('email') email: string) {
    return await this.enrolmentsService.GetAllEnrolmentsWithTeacher(email);
  }
  // @Roles(Role.teacher)
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

  @Get('/myAllSlots/:email')
  async getMyAllSlots(@Param('email') email: string) {
    return await this.slotService.getSlotsByEmail(email);
  }

  @Post('/createSlot')
  async createSlot(@Body() createSlotDto: CreateSlotDto) {
    return await this.slotService.createSlot(createSlotDto);
  }

  @Patch('/updateSlot/:id')
  async updateSlot(
    @Param('id') id: string,
    @Body() updateSlotDto: UpdateSlotDto,
  ) {
    const updatedSlot = await this.slotService.updateSlot(
      Number(id),
      updateSlotDto,
    );
    return { success: true, data: updatedSlot };
  }

  @Delete('/deleteSlot/:id')
  async deleteSlot(@Param('id') id: string) {
    const result = await this.slotService.deleteSlot(Number(id));
    return { success: true, data: result };
  }

  @Get('getMyAppointments/:email')
  async getAppointmentsByEmail(@Param('email') email: string) {
    const appointments =
      await this.appointmentService.getAppointmentsByTeacher(email);
    return appointments;
  }

  @Patch('/approveRejectAppointment/:id')
  async approveRejectAppointment(
    @Param('id') id: number,
    @Body() approveRejectDto: ApproveRejectDto,
  ) {
    return await this.appointmentService.ApproveRejectAppointment(
      id,
      approveRejectDto,
    );
  }

  @Post('/uploadProfilePicture/:email')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  async UploadPicture(
    @Param('email') email: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.teacherService.uploadTeacherProfilePicture(email, image);
  }

  @Post('/updateProfile/:email')
  @HttpCode(HttpStatus.OK)
  async UpdateProfile(
    @Param('email') email: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    return await this.teacherService.updateTeacherProfile(
      email,
      updateTeacherDto,
    );
  }
}
