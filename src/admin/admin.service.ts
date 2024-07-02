/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Student } from 'src/students/entities/student';

import { Teacher } from 'src/teachers/entities/teacher';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin';
import * as FormData from 'form-data';
import axios from 'axios';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
  ) {}
  async SuspendStudent(email: string) {
    const student = await this.studentRepository.findOneBy({ email: email });
    if (!student) {
      throw new BadRequestException("Student doesn't exist");
    }
    const suspended_student = await this.studentRepository.update(
      { email: email },
      { is_suspended: true },
    );
    return {
      message: 'Student suspended successfully',
      SuspendedStudent: suspended_student,
    };
  }
  async SuspendTeacher(email: string) {
    const teacher = await this.teacherRepository.findOneBy({ email: email });
    if (!teacher) {
      throw new BadRequestException("Teacher doesn't exist");
    }
    const suspended_teacher = await this.teacherRepository.update(
      { email: email },
      { is_suspended: true },
    );
    return {
      message: 'Teacher suspended successfully',
      SuspendedTeacher: suspended_teacher,
    };
  }

  async uploadAdminProfilePicture(email: string, image: Express.Multer.File) {
    const admin = await this.adminRepository.findOne({
      where: { email: email },
    });
    if (!admin) {
      throw new NotFoundException(`Admin with email ${email} not found`);
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
    admin.img = imageUrl;
    await this.adminRepository.save(admin);
    return imageUrl;
  }
}
