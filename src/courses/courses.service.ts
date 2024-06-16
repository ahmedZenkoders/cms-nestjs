import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/createCourse.dto';
import { RemoveCourseDto } from './dto/removeCourse.dto';
import { Course } from './entities/course';

@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(Course)
        private courseRepository: Repository<Course>,
    ) { }

    async getAllCourses() {
        const courses = await this.courseRepository.find();
        return courses.map(course => course.name);
    }

    async addCourses(createcoursedto: CreateCourseDto) {
        const existingCourse = await this.courseRepository.findOne({ where: { coursecode: createcoursedto.coursecode } });
        if (existingCourse) {
            throw new BadRequestException(`${createcoursedto.name} Course  already exists`);
        }

        const course = await this.courseRepository.create({
            ...createcoursedto, created_at: new Date(Date.now()),
            updated_at: new Date(Date.now()),
        });
        await this.courseRepository.save(course);
        return { data: course, message: `${createcoursedto.name} course is created: ` };
    }

    async removeCourses(removecoursedto: RemoveCourseDto) {
        const existingCourse = await this.courseRepository.findOne({ where: { coursecode: removecoursedto.coursecode } });
        if (!existingCourse) {
            throw new BadRequestException(`${removecoursedto.coursecode} didn't exist `);
        }
        await this.courseRepository.delete(removecoursedto);
        return { data: existingCourse, message: `${removecoursedto.coursecode} course is deleted` }
    }
}
