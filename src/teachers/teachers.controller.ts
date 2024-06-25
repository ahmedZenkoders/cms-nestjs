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
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { UpdateAppointmentDto } from 'src/appointments/dto/updateAppointment.dto';
import { CourseService } from 'src/courses/courses.service';
import { CreateCourseDto } from 'src/courses/dto/createCourse.dto';
import { UpdateCourseDto } from 'src/courses/dto/updateCourse.dto';
import { Roles } from 'src/decorator/role.decorator';
import { EnrolmentService } from 'src/enrolment/enrolment.service';
import { Role } from 'src/enum/role.enum';
import { CreateSlotDto } from 'src/slots/dto/createSlot.dto';
import { UpdateSlotDto } from 'src/slots/dto/updateSlot.dto';
import { SlotService } from 'src/slots/slots.service';

@Controller('teacher')
export class TeachersController {
  constructor(
    private readonly enrolmentsService: EnrolmentService,
    private readonly courseService: CourseService,
    private readonly slotService: SlotService,
    private appointmentService: AppointmentsService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Roles(Role.teacher)
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

  @Put('/updateAppointment:id')
  async updateAppointment(@Param('id') id: number, @Body() updateAppointmentDto: UpdateAppointmentDto) {
          const appointment = await this.appointmentService.updateAppointment(id, updateAppointmentDto);
          return appointment;
  
  }

  @Delete('/deleteAppointment/:id')
  async deleteAppointment(@Param('id') id: number) {

          const result = await this.appointmentService.deleteAppointment(id);
          return result;
    
  }

  @Get('getMyAppointments/:email')
  async getAppointmentsByTeacher(@Param('email') email: string) {
          const appointments = await this.appointmentService.getAppointmentsByTeacher(email);
          return appointments;
     
  }
}
