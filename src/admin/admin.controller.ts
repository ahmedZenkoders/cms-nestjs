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
import { CourseService } from 'src/courses/courses.service';

import { Roles } from 'src/decorator/role.decorator';
import { DomainService } from 'src/domain/domain.service';
import { CreateDomainDto } from 'src/domain/dto/createDomain.dto';
import { Role } from 'src/enum/role.enum';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/role.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.admin)
@Controller('admin')
export class AdminController {
  constructor(
    private domainService: DomainService,
    private courseService: CourseService,
  ) {}

  @Post('addDomain')
  async addDomain(@Body() createdomaindto: CreateDomainDto) {
    const domain = await this.domainService.addAllowedDomain(createdomaindto);
    HttpCode(HttpStatus.CREATED);
    return domain;
  }
  @Post('removeDomain')
  async removeDomain(@Body() createdomaindto: CreateDomainDto) {
    const domain =
      await this.domainService.removeAllowedDomain(createdomaindto);
    HttpCode(HttpStatus.OK);
    return domain;
  }
  @Get('getCourses')
  async getAllCourses() {
    HttpCode(HttpStatus.ACCEPTED);

    return this.courseService.getAllCourses();
  }
}
