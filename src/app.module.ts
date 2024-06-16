/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
import { EmailDomainGuard } from './guards/email.guard';
import { DomainService } from './domain/domain.service';
import { DomainModule } from './domain/domain.module';
import { Domain } from './domain/entities/domain';
import { Course } from './courses/entities/course';
import { CourseService } from './courses/courses.service';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'postgres',
      password: 'ahmedsiddiqui',
      database: 'CMS',
      entities: [Student, Teacher,Admin,Domain,Course],
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: 'mysecretkey',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([Student, Teacher,Admin,Domain,Course]),
    AuthModule,
    StudentsModule,
    TeachersModule,
    AdminModule,
    CoursesModule,
    DomainModule,
  ],
  controllers: [AdminController],
  providers: [DomainService, EmailDomainGuard,CourseService],
})
export class AppModule { }