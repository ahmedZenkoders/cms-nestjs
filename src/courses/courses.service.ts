/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/createCourse.dto';
import { UpdateCourseDto } from './dto/updateCourse.dto';
import { Teacher } from 'src/teachers/entities/teacher';
import { PaginationSearchDto } from 'src/students/dto/pagination-search.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private courserepository: Repository<Course>,
    @InjectRepository(Teacher) private teacherrepository: Repository<Teacher>,
  ) {}
  async addCourse(createCourseDto: CreateCourseDto) {
    try {
      const alreadyExist = await this.courserepository.findOneBy({
        coursecode: createCourseDto.coursecode,
      });
      const teacherWithId = await this.teacherrepository.findOneBy({
        email: createCourseDto.teacher_id,
      });
      if (!teacherWithId) {
        throw new BadRequestException('Teacher doesnot exist');
      }
      if (alreadyExist) {
        throw new BadRequestException('Course Already exist');
      }
      if (new Date(createCourseDto.deadline) < new Date()) {
        throw new BadRequestException(
          'Deadline cannot be lesser than current date',
        );
      }
      const addCourse = this.courserepository.create({
        ...createCourseDto,
        teacher_id: teacherWithId,
        created_at: new Date(),
        updated_at: new Date(),
      });
      await this.courserepository.save(addCourse);

      return {
        message: 'Course Created Successfully',
        course: addCourse,
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }
  async getAllCourses(paginationSearchDto: PaginationSearchDto) {
    try {
      const { page, limit, search } = paginationSearchDto;
      const query = this.courserepository.createQueryBuilder('courses');

      if (search) {
        query.where(
          'courses.coursecode ILIKE :search OR courses.name ILIKE :search',
          { search: `%${search}%`.toLowerCase() },
        );
      }

      const [result, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        data: result,
        count: total,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getCourseById(id: string) {
    const course = await this.courserepository.findOneBy({
      coursecode: id,
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }
  async updateCourse(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      const teacherId = await this.teacherrepository.findOneBy({
        email: updateCourseDto.teacher_id,
      });
      if (!teacherId) {
        throw new Error('Teacher doesnot exist');
      }
      const course = await this.courserepository.findOneBy({
        coursecode: id,
        teacher_id: teacherId,
      });
      if (course) {
        return this.courserepository.save({ ...course, updateCourseDto });
      }
      throw new NotFoundException('Course doesnot exist');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async removeCourse(id: string, email: string) {
    try {
      const teacherId = await this.teacherrepository.findOneBy({
        email: email,
      });
      if (!teacherId) {
        throw new Error('Teacher doesnot exist');
      }
      const courseExist = await this.courserepository.findOneBy({
        coursecode: id,
        teacher_id: teacherId,
      });
      if (
        courseExist.coursecode &&
        new Date(courseExist.deadline) > new Date()
      ) {
        const removedCourse = await this.courserepository.delete(
          courseExist.coursecode,
        );
        if (removedCourse.affected >= 1) {
          return {
            message: 'Course deleted successfully ',
            course: courseExist.coursecode,
            status: HttpStatus.OK,
          };
        }
      }

      throw new BadRequestException('Course doesnot exist');
    } catch (error) {
      throw new InternalServerErrorException(error.messsage);
    }
  }
}
