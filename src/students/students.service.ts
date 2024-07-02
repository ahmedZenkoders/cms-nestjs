/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student';
import { Repository } from 'typeorm';
import { PaginationSearchDto } from './dto/pagination-search.dto';
import { UpdateStudentDto } from './dto/updateStudent.dto';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private StudentRepository: Repository<Student>,
  ) {}

  async ViewProfileDetails(email: string) {
    const studentProfile = await this.StudentRepository.findOneBy({
      email: email,
    });
    return { student: studentProfile };
  }

  async getAllStudents(paginationSearchDto: PaginationSearchDto) {
    try {
      const { page, limit, search } = paginationSearchDto;
      const query = this.StudentRepository.createQueryBuilder('students');

      if (search) {
        query.where(
          'student.username LIKE :search OR student.email LIKE :search',
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

  async updateStudentProfile(
    email: string,
    updateStudentDto: UpdateStudentDto,
  ) {
    const student = await this.StudentRepository.findOne({
      where: { email: email },
    });
    if (!student) {
      throw new NotFoundException(`Student with email ${email} not found`);
    }

    this.StudentRepository.merge(student, updateStudentDto);
    await this.StudentRepository.save(student);
    return student;
  }

  async uploadStudentProfilePicture(email: string, image: Express.Multer.File) {
    const student = await this.StudentRepository.findOne({
      where: { email: email },
    });
    if (!student) {
      throw new NotFoundException(`Student with email ${email} not found`);
    }
    const apikey = 'a7dae0970d96558ba7367c8c4e84ecb8';
    const url = `https://api.imgbb.com/1/upload?key=${apikey}`;
    const formData = new FormData();
    formData.append('image', image.buffer.toString('base64'));
    const response = await axios.post(url, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    const imageUrl = response.data.data.url;
    student.img = imageUrl;
    await this.StudentRepository.save(student);
    return imageUrl;
  }
}
