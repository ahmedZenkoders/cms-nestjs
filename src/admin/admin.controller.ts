/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  Get,
  Query,
  UseInterceptors,
  Param,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { CourseService } from 'src/courses/courses.service';

import { Roles } from 'src/decorator/role.decorator';
import { DomainService } from 'src/domain/domain.service';
import { CreateDomainDto } from 'src/domain/dto/createDomain.dto';
import { EnrolmentService } from 'src/enrolment/enrolment.service';
import { Role } from 'src/enum/role.enum';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { SlotService } from 'src/slots/slots.service';
import { PaginationSearchDto } from 'src/students/dto/pagination-search.dto';
import { AdminService } from './admin.service';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private domainService: DomainService,
    private courseService: CourseService,
    private slotService: SlotService,
    private appointmentService: AppointmentsService,
    private enrolmentService: EnrolmentService,
    private adminService: AdminService,
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
  async getAllCourses(@Query() paginationSearchDto: PaginationSearchDto) {
    HttpCode(HttpStatus.ACCEPTED);

    return this.courseService.getAllCourses(paginationSearchDto);
  }
  @Roles(Role.admin)
  @Get()
  async getAllSlots() {
    const slots = await this.slotService.getAllSlots();
    return { success: true, data: slots };
  }

  @Get('/getAllAppointments')
  async getAllAppointments(@Query() paginationSearchDto: PaginationSearchDto) {
    const appointments =
      await this.appointmentService.getAllAppointments(paginationSearchDto);
    return appointments;
  }

  @Get('/getAllEnrolments')
  async getAllEnrolments(@Query() paginationSearchDto: PaginationSearchDto) {
    const enrolments =
      await this.enrolmentService.getAllEnrolments(paginationSearchDto);
    return enrolments;
  }
  @Get('/getAllCourses')
  async getCourses(@Query() paginationSearchDto: PaginationSearchDto) {
    const courses = await this.courseService.getAllCourses(paginationSearchDto);
    return courses;
  }

  @Post('/uploadProfilePicture/:email')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  async UploadPicture(
    @Param('email') email: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.adminService.uploadAdminProfilePicture(email, image);
  }
}
