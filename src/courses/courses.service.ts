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

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private CourseRepository: Repository<Course>,
    @InjectRepository(Teacher) private TeacherRepository: Repository<Teacher>,
  ) {}
  async addCourse(createCourseDto: CreateCourseDto) {
    try {
      const alreadyExist = await this.CourseRepository.findOneBy({
        coursecode: createCourseDto.coursecode,
      });
      const teacherWithId = await this.TeacherRepository.findOneBy({
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
      const addCourse = this.CourseRepository.create({
        ...createCourseDto,
        teacher_id: teacherWithId,
        created_at: new Date(),
        updated_at: new Date(),
      });
      await this.CourseRepository.save(addCourse);

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
  async getAllCourses() {
      const courses = await this.CourseRepository.find();
      if (courses.length >= 1) {
        return {
          courses,
        };
      }
      throw new NotFoundException('No course available');
    
  }
  async updateCourse(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      const teacherId = await this.TeacherRepository.findOneBy({
        email: updateCourseDto.teacher_id,
      });
      if (!teacherId) {
        throw new Error('Teacher doesnot exist');
      }
      const course = await this.CourseRepository.findOneBy({
        coursecode: id,
        teacher_id: teacherId,
      });
      if (course) {
        return this.CourseRepository.save({ ...course, updateCourseDto });
      }
      throw new NotFoundException('Course doesnot exist');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async removeCourse(id: string, email: string) {
    try {
      const teacherId = await this.TeacherRepository.findOneBy({
        email: email,
      });
      if (!teacherId) {
        throw new Error('Teacher doesnot exist');
      }
      const courseExist = await this.CourseRepository.findOneBy({
       coursecode: id,
        teacher_id: teacherId,
      });
      if (courseExist.coursecode && new Date(courseExist.deadline) > new Date()) {
        const removedCourse = await this.CourseRepository.delete(
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