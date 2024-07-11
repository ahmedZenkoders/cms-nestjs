/* eslint-disable prettier/prettier */

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
import { DomainService } from 'src/domain/domain.service';
import { OtpService } from 'src/otp/otp.service';
import { VerifyOtpDto } from 'src/otp/dto/verifyOtp.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,

    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,

    private domainservice: DomainService,
    private otpservice: OtpService,
    private readonly jwtService: JwtService,
  ) {}

  async adminSignUp(createadmindto: CreateAdminDto) {
    await this.domainservice.isDomainAllowed(createadmindto.email);
    const existingUser = await this.adminRepository.findOneBy({
      email: createadmindto.email,
    });
    if (existingUser) {
      throw new HttpException('Email Already taken.', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(createadmindto.password, 10);

    await this.otpservice.generateOtp({ email: createadmindto.email });
    const user = this.adminRepository.create({
      ...createadmindto,
      password: hashedPassword,

      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now()),
    });
    this.adminRepository.save(user);
    return { data: user };
  }
  async teacherSignUp(createteacherdto: CreateTeacherDto) {
    await this.domainservice.isDomainAllowed(createteacherdto.email);
    const existingUser = await this.teacherRepository.findOneBy({
      email: createteacherdto.email,
    });
    if (existingUser) {
      throw new HttpException('Email Already taken.', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(createteacherdto.password, 10);

    await this.otpservice.generateOtp({ email: createteacherdto.email });
    const user = this.teacherRepository.create({
      ...createteacherdto,
      password: hashedPassword,

      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now()),
    });

    await this.teacherRepository.save(user);
    return { data: user };
  }

  async studentSignUp(createstudentdto: CreateStudentDto) {
    await this.domainservice.isDomainAllowed(createstudentdto.email);
    const existingUser = await this.studentRepository.findOneBy({
      email: createstudentdto.email,
    });
    if (existingUser) {
      throw new HttpException('Email Already taken.', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(createstudentdto.password, 10);

    await this.otpservice.generateOtp({ email: createstudentdto.email });
    const user = this.studentRepository.create({
      ...createstudentdto,
      password: hashedPassword,

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
    if (user.is_suspended === true) {
      throw new UnauthorizedException("Can't Login.You have been suspended");
    }

    return { message: 'Logged in successfully', data: user };
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
    if (user.is_suspended === true) {
      throw new UnauthorizedException("Can't Login.You have been suspended");
    }

    return { message: 'Logged in successfully', data: user };
  }

  async validateUser(userToken: string): Promise<{
    id: number;
    email: string;
  }> {
    const user = await this.jwtService.verifyAsync(userToken);
    return user;
  }
}
