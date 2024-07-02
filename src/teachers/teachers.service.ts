/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationSearchDto } from 'src/students/dto/pagination-search.dto';
import { Teacher } from './entities/teacher';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as FormData from 'form-data';
import { UpdateTeacherDto } from './dto/updateTeacher.dto';
@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
  ) {}

  async ViewProfileDetails(email: string) {
    const teacherProfile = await this.teacherRepository.findOneBy({
      email: email,
    });
    if (!teacherProfile) {
      throw new BadRequestException('Teacher not found');
    }
    return { teacher: teacherProfile };
  }

  async updateTeacherProfile(
    email: string,
    updateTeacherDto: UpdateTeacherDto,
  ) {
    const teacher = await this.teacherRepository.findOne({
      where: { email: email },
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher with email ${email} not found`);
    }

    this.teacherRepository.merge(teacher, updateTeacherDto);
    await this.teacherRepository.save(teacher);
    return teacher;
  }

  async getAllTeachers(paginationSearchDto: PaginationSearchDto) {
    try {
      const { page, limit, search } = paginationSearchDto;
      const query = this.teacherRepository.createQueryBuilder('teachers');

      if (search) {
        query.where(
          'teacher.username LIKE :search OR teacher.email LIKE :search',
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

  async uploadTeacherProfilePicture(email: string, image: Express.Multer.File) {
    const teacher = await this.teacherRepository.findOne({
      where: { email: email },
    });
    if (!teacher) {
      throw new NotFoundException(`teacher with email ${email} not found`);
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
    teacher.img = imageUrl;
    await this.teacherRepository.save(teacher);
    return imageUrl;
  }
}
