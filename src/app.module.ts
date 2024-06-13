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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'ahmedsiddiqui',
      database: 'CMS',
      entities: [Student, Teacher],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Student, Teacher]),
    AuthModule,
    StudentsModule,
    TeachersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }