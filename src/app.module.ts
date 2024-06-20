/* eslint-disable prettier/prettier */
import {  Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { Student } from './students/entities/student';
import { TeachersModule } from './teachers/teachers.module';
import { Teacher } from './teachers/entities/teacher';
import { AdminModule } from './admin/admin.module';
import { Admin } from './admin/entities/admin';
import { JwtModule } from '@nestjs/jwt';
import { CoursesModule } from './courses/courses.module';
import { AdminController } from './admin/admin.controller';
import { DomainService } from './domain/domain.service';
import { DomainModule } from './domain/domain.module';
import { Domain } from './domain/entities/domain';
import { Course } from './courses/entities/course';
import { CourseService } from './courses/courses.service';
import { UploadService } from './upload/upload.service';
import { UploadController } from './upload/upload.controller';
import { UploadModule } from './upload/upload.module';
import { RolesGuard } from './guards/role.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { jwtConstant } from './auth/constants';
import { MulterModule } from '@nestjs/platform-express';
import { OtpModule } from './otp/otp.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'ahmedsiddiqui',
      database: 'CMS',
      entities: [Student,Teacher,Admin,Domain,Course],
      synchronize: true,
    }),
    MulterModule.register(
      {dest:"./uploads"}
    )
    ,
    JwtModule.register({
      global: true,
      secret: jwtConstant.secret,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([Student,Teacher,Admin,Domain,Course]),
    AuthModule,
    StudentsModule,
    TeachersModule,
    AdminModule,
    CoursesModule,
    DomainModule,
    UploadModule,
    OtpModule,
  ],
  controllers: [AdminController, UploadController],
  providers: [DomainService,CourseService, UploadService,RolesGuard,JwtAuthGuard],
})
export class AppModule {
 }