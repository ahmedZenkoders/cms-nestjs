/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
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
import { UploadModule } from './upload/upload.module';
import { RolesGuard } from './guards/role.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { jwtConstant } from './auth/constants';
import { MulterModule } from '@nestjs/platform-express';
import { OtpModule } from './otp/otp.module';
import { Otp } from './otp/entities/otp';
import { OtpService } from './otp/otp.service';
import { MailService } from './mail/mail.service';
import { TeachersController } from './teachers/teachers.controller';
import { StudentsController } from './students/students.controller';
import { DomainController } from './domain/domain.controller';
import { OtpController } from './otp/otp.controller';
import { CoursesController } from './courses/courses.controller';
import { EnrolmentModule } from './enrolment/enrolment.module';
import { Enrolment } from './enrolment/entities/enrolment';
import { EnrolmentService } from './enrolment/enrolment.service';
import { StudentsService } from './students/students.service';
import { SlotsController } from './slots/slots.controller';
import { SlotsModule } from './slots/slots.module';
import { AppointmentsService } from './appointments/appointments.service';
import { AppointmentsController } from './appointments/appointments.controller';
import { AppointmentsModule } from './appointments/appointments.module';
import { Appointment } from './appointments/entities/appointment';
import { Slot } from './slots/entities/slots';
import { SlotService } from './slots/slots.service';
import { ChatModule } from './chat/chat.module';
import { MessagesModule } from './messages/messages.module';
import { Chat } from './chat/entities/chat';
import { Message } from './messages/entities/message';
import { MessagesController } from './messages/messages.controller';
import { ChatsController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { MessageService } from './messages/messages.service';
import { ChatGateway } from './chat/chat.gateway';
import { TeachersService } from './teachers/teachers.service';
import { AdminService } from './admin/admin.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'ahmedsiddiqui',
      database: 'CMS',
      entities: [
        Student,
        Teacher,
        Admin,
        Domain,
        Course,
        Otp,
        Enrolment,
        Appointment,
        Slot,
        Chat,
        Message,
      ],
      synchronize: true,
    }),
    MulterModule.register({ dest: './uploads' }),
    JwtModule.register({
      global: true,
      secret: jwtConstant.secret,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([
      Student,
      Teacher,
      Admin,
      Domain,
      Course,
      Otp,
      Enrolment,
      Appointment,
      Slot,
      Message,
      Chat,
    ]),
    AuthModule,
    StudentsModule,
    TeachersModule,
    AdminModule,
    CoursesModule,
    DomainModule,
    UploadModule,
    OtpModule,
    EnrolmentModule,
    SlotsModule,
    AppointmentsModule,
    ChatModule,
    MessagesModule,
  ],
  controllers: [
    AdminController,
    TeachersController,
    StudentsController,
    DomainController,
    OtpController,
    CoursesController,
    SlotsController,
    AppointmentsController,
    MessagesController,
    ChatsController,
  ],
  providers: [
    DomainService,
    CourseService,
    UploadService,
    RolesGuard,
    JwtAuthGuard,
    OtpService,
    MailService,
    EnrolmentService,
    StudentsService,
    AppointmentsService,
    SlotService,
    ChatService,
    MessageService,
    TeachersService,
    AdminService,
    ChatGateway,
  ],
})
export class AppModule {}
