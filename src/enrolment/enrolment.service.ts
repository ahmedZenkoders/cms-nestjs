/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrolment } from './entities/enrolment';
import { CreateEnrolmentDto } from './dto/createEnrolment.dto';
import { Student } from 'src/students/entities/student';
import { Course } from 'src/courses/entities/course';
import { EnrolmentStatus } from 'src/enum/enrolment.enum';
import { RemoveCourseDto } from './dto/removeCourse.dto';
import { PaginationSearchDto } from 'src/students/dto/pagination-search.dto';
import { PaymentStatus } from 'src/enum/payment.enum';

@Injectable()
export class EnrolmentService {
  constructor(
    @InjectRepository(Enrolment)
    private EnrolmentRepository: Repository<Enrolment>,
    @InjectRepository(Student)
    private StudentRepository: Repository<Student>,
    @InjectRepository(Course)
    private CourseRepository: Repository<Course>,
  ) {}

  async CreateEnrolment(createEnrolmentDto: CreateEnrolmentDto) {
    const studentwithId = await this.StudentRepository.findOneBy({
      email: createEnrolmentDto.student_id,
    });
    const coursewithCode = await this.CourseRepository.findOneBy({
      coursecode: createEnrolmentDto.coursecode,
    });
    const alreadyEnrolledStudent = await this.EnrolmentRepository.findOneBy({
      course_code: coursewithCode,
      student_id: studentwithId,
    });
    if (alreadyEnrolledStudent) {
      throw new BadRequestException(
        'Student is already enrolled in this course',
      );
    }
    if (!studentwithId) {
      throw new BadRequestException('Student with this id doesnot exist');
    }
    if (!coursewithCode) {
      throw new BadRequestException('Course doesnot exist');
    }
    if (new Date(coursewithCode.deadline) < new Date()) {
      throw new BadRequestException('Deadline has been passed');
    }

    if (studentwithId.payment_id.status === PaymentStatus.Successful) {
      const enrolment = this.EnrolmentRepository.create({
        student_id: studentwithId,
        course_code: coursewithCode,
        created_at: new Date(),
        status: EnrolmentStatus.active,
      });
      await this.EnrolmentRepository.save(enrolment);
      return {
        message: 'Student enrolled successfully',
        enrolment: {
          enrolmentId: enrolment.id,
          student: studentwithId,
          course: coursewithCode,
        },
      };
    } else if (
      studentwithId.payment_id.status === PaymentStatus.Pending ||
      studentwithId.payment_id.status === PaymentStatus.Failed
    ) {
      throw new BadRequestException('First Complete the Transaction');
    }
  }
  async getAllEnrolments(paginationSearchDto: PaginationSearchDto) {
    try {
      const { page, limit, search } = paginationSearchDto;
      const query = this.EnrolmentRepository.createQueryBuilder('enrolment');

      if (search) {
        query.where(
          'enrolment.coursecode LIKE :search OR enrolment.student_id LIKE :search',
          { search: `%${search}%` },
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

  async getAllEnrolmentsWithStudent(studentEmail: string) {
    const student = await this.StudentRepository.findOneBy({
      email: studentEmail,
    });
    if (!student) {
      throw new NotFoundException('Student Not found');
    }

    const studentEnrolment = await this.EnrolmentRepository.findOne({
      where: { student_id: student },
    });
    if (!studentEnrolment) {
      throw new NotFoundException('No enrolment Found for this student');
    }
    return studentEnrolment;
  }

  async GetAllEnrolmentsWithTeacher(teacherEmail: string) {
    try {
      const studentsEnrolled =
        await this.EnrolmentRepository.createQueryBuilder('enrolment')
          .innerJoinAndSelect('enrolment.course_code', 'course')
          .innerJoin('course.teacher_id', 'teacher')
          .innerJoinAndSelect('enrolment.student_id', 'student')
          .where('teacher.email = :teacherEmail', {
            teacherEmail: teacherEmail,
          })
          .getMany();

      if (!studentsEnrolled || studentsEnrolled.length === 0) {
        throw new NotFoundException(
          'No students enrolled in courses taught by this teacher',
        );
      }
      const transformedEnrolments = studentsEnrolled.map((enrolments) => ({
        enrolment: {
          id: enrolments.id,
          status: enrolments.status,
          created_at: enrolments.created_at.toISOString().split('T')[0],
        },
        course_code: {
          code: enrolments.course_code.coursecode,
          name: enrolments.course_code.name,
          description: enrolments.course_code.description,
          deadline: enrolments.course_code.deadline,
        },
        student_id: {
          email: enrolments.student_id.email,
          username: enrolments.student_id.username,
        },
      }));

      return {
        studentsEnrolled: transformedEnrolments,
      };
    } catch (error) {
      console.error('Error fetching students enrolled:', error);
      throw new BadRequestException('Error fetching students enrolled');
    }
  }
  async RemoveCourse(removeCourseDto: RemoveCourseDto) {
    try {
      const studentExist = await this.StudentRepository.findOneBy({
        email: removeCourseDto.student_id,
      });
      if (!studentExist) {
        throw new BadRequestException('Student with this id doesnot exist');
      }
      const courseExist = await this.CourseRepository.findOneBy({
        coursecode: removeCourseDto.coursecode,
      });
      if (!courseExist) {
        throw new BadRequestException('Course doesnot exist');
      }
      if (courseExist && new Date(courseExist.deadline) < new Date()) {
        throw new BadRequestException('Deadline has passed');
      }
      const enrolmentExist = await this.EnrolmentRepository.findOneBy({
        student_id: studentExist,
        course_code: courseExist,
      });
      if (!enrolmentExist) {
        throw new BadRequestException('Student is not enrolled in this course');
      }
      const droppedCourse =
        await this.EnrolmentRepository.delete(enrolmentExist);

      if (droppedCourse.affected >= 1) {
        const { id, created_at } = enrolmentExist;
        const { coursecode, student_id } = removeCourseDto;
        return {
          message: 'Course dropped successfully',
          DroppedCourse: {
            id,
            coursecode,
            student_id,
            created_at,
          },
        };
      }
      return {
        message: 'Error in dropping course',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
