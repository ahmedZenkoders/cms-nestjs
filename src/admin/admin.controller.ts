/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { CourseService } from 'src/courses/courses.service';

import { Roles } from 'src/decorator/role.decorator';
import { DomainService } from 'src/domain/domain.service';
import { CreateDomainDto } from 'src/domain/dto/createDomain.dto';
import { Role } from 'src/enum/role.enum';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { SlotService } from 'src/slots/slots.service';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private domainService: DomainService,
    private courseService: CourseService,
    private slotService: SlotService,
    private appointmentService: AppointmentsService,
  ) {}
  @Roles(Role.admin)
  @Post('addDomain')
  async addDomain(@Body() createdomaindto: CreateDomainDto) {
    const domain = await this.domainService.addAllowedDomain(createdomaindto);
    HttpCode(HttpStatus.CREATED);
    return domain;
  }
  @Roles(Role.admin)
  @Post('removeDomain')
  async removeDomain(@Body() createdomaindto: CreateDomainDto) {
    const domain =
      await this.domainService.removeAllowedDomain(createdomaindto);
    HttpCode(HttpStatus.OK);
    return domain;
  }
  @Roles(Role.admin)
  @Get('getCourses')
  async getAllCourses() {
    HttpCode(HttpStatus.ACCEPTED);

    return this.courseService.getAllCourses();
  }
  @Roles(Role.admin)
  @Get()
  async getAllSlots() {
    const slots = await this.slotService.getAllSlots();
    return { success: true, data: slots };
  }

  @Get('/getAllAppointments')
  async getAllAppointments() {
    const appointments = await this.appointmentService.getAllAppointments();
    return appointments;
  }
}
