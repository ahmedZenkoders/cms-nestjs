/* eslint-disable prettier/prettier */
import { Controller, Post, Body, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { CourseService } from 'src/courses/courses.service';
import { CreateCourseDto } from 'src/courses/dto/createCourse.dto';
import { RemoveCourseDto } from 'src/courses/dto/removeCourse.dto';
import { Roles } from 'src/decorator/role.decorator';
import { DomainService } from 'src/domain/domain.service';
import { CreateDomainDto } from 'src/domain/dto/createDomain.dto';
import { Role } from 'src/enum/role.enum';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/role.guard';

@UseGuards(JwtAuthGuard,RolesGuard )
@Roles(Role.admin)
@Controller('admin')
export class AdminController {
    constructor(private  domainService: DomainService,
        private  courseService:CourseService
    ) { }
    
    
    @Post('addDomain')
    async addDomain(@Body() createdomaindto: CreateDomainDto) {

        const domain = await this.domainService.addAllowedDomain(createdomaindto);
        HttpCode(HttpStatus.CREATED);
        return domain;
    }
    @Post('removeDomain')
    async removeDomain(@Body() createdomaindto: CreateDomainDto) {
        const domain = await this.domainService.removeAllowedDomain(createdomaindto);
        HttpCode(HttpStatus.OK);
        return domain;
    }

    @Post('addCourse') 
    async addCourse(@Body() createcoursedto: CreateCourseDto){
        const course = await this.courseService.addCourses(createcoursedto);
        HttpCode(HttpStatus.CREATED);
        return course;
    }

    @Post('removeCourse') 
    async removeCourse(@Body() removecoursedto: RemoveCourseDto){
        const course = await this.courseService.removeCourses(removecoursedto);
        HttpCode(HttpStatus.OK);
        return course;
    }
}

