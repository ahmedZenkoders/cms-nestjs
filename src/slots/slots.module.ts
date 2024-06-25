/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SlotService } from './slots.service';
import { Slot } from './entities/slots';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from 'src/teachers/entities/teacher';
import { TeachersService } from 'src/teachers/teachers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Slot, Teacher])],
  providers: [SlotService, TeachersService],
})
export class SlotsModule {}
