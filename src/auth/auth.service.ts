/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateStudentDto } from 'src/students/dto/createStudent.dto';
import * as bcrypt from 'bcrypt';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginStudentDto } from 'src/students/dto/loginStudent.dto';
import { CreateTeacherDto } from 'src/teachers/dto/createTeacher.dto';
import { LoginTeacherDto } from 'src/teachers/dto/loginTeacher.dto';
import { Admin } from 'src/admin/entities/admin';
import { CreateAdminDto } from 'src/admin/dto/createAdmin.dto';
import { LoginAdminDto } from 'src/admin/dto/loginAdmin.dto';
import { UploadService } from 'src/upload/upload.service';
import { DomainService } from 'src/domain/domain.service';
import { OtpService } from 'src/otp/otp.service';
import { VerifyOtpDto } from 'src/otp/dto/verifyOtp.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,

    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private uploadservice: UploadService,
    private domainservice: DomainService,
    private otpservice: OtpService,
  ) {}

  async adminSignUp(
    createadmindto: CreateAdminDto,
    image: Express.Multer.File,
  ) {
    await this.domainservice.isDomainAllowed(createadmindto.email);
    const existingUser = await this.adminRepository.findOneBy({
      email: createadmindto.email,
    });
    if (existingUser) {
      throw new HttpException('Email Already taken.', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(createadmindto.password, 10);
    const imageurl = await this.uploadservice.uploadImage(image);
    await this.otpservice.generateOtp({ email: createadmindto.email });
    const user = this.adminRepository.create({
      ...createadmindto,
      password: hashedPassword,
      img: imageurl,
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now()),
    });
    this.adminRepository.save(user);
    return { data: user };
  }
  async teacherSignUp(
    createteacherdto: CreateTeacherDto,
    image: Express.Multer.File,
  ) {
    await this.domainservice.isDomainAllowed(createteacherdto.email);
    const existingUser = await this.teacherRepository.findOneBy({
      email: createteacherdto.email,
    });
    if (existingUser) {
      throw new HttpException('Email Already taken.', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(createteacherdto.password, 10);
    const imageurl = await this.uploadservice.uploadImage(image);
    await this.otpservice.generateOtp({ email: createteacherdto.email });
    const user = this.teacherRepository.create({
      ...createteacherdto,
      password: hashedPassword,
      img: imageurl,
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now()),
    });

    return { data: user };
  }

  async studentSignUp(
    createstudentdto: CreateStudentDto,
    image: Express.Multer.File,
  ) {
    await this.domainservice.isDomainAllowed(createstudentdto.email);
    const existingUser = await this.studentRepository.findOneBy({
      email: createstudentdto.email,
    });
    if (existingUser) {
      throw new HttpException('Email Already taken.', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(createstudentdto.password, 10);
    const imageurl = await this.uploadservice.uploadImage(image);
    await this.otpservice.generateOtp({ email: createstudentdto.email });
    const user = this.studentRepository.create({
      ...createstudentdto,
      password: hashedPassword,
      img: imageurl,
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now()),
    });

    this.studentRepository.save(user);
    return { data: user };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto, entity: string) {
    return this.otpservice.verifyOtp(verifyOtpDto, entity);
  }

  async adminLogin(loginadmindto: LoginAdminDto) {
    const user = await this.adminRepository.findOneBy({
      email: loginadmindto.email,
    });
    if (!user) {
      throw new UnauthorizedException('Enter Valid Credentials');
    }
    const isMatch = await bcrypt.compare(loginadmindto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid Password');
    }
  }
  async teacherLogin(loginteacherdto: LoginTeacherDto) {
    const user = await this.teacherRepository.findOneBy({
      email: loginteacherdto.email,
    });
    if (!user) {
      throw new UnauthorizedException('Enter Valid Credentials');
    }
    const isMatch = await bcrypt.compare(
      loginteacherdto.password,
      user.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid Password');
    }
  }
  async studentLogin(loginstudentdto: LoginStudentDto) {
    const user = await this.studentRepository.findOneBy({
      email: loginstudentdto.email,
    });

    if (!user) {
      throw new UnauthorizedException('Enter Valid Credentials');
    }
    const isMatch = await bcrypt.compare(
      loginstudentdto.password,
      user.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid Password');
    }
  }
}
