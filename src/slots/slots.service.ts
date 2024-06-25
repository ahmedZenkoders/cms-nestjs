/* eslint-disable prettier/prettier */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slot } from './entities/slots';
import { CreateSlotDto } from './dto/createSlot.dto';
import { Teacher } from '../teachers/entities/teacher';
import { UpdateSlotDto } from './dto/updateSlot.dto';

@Injectable()
export class SlotService {
  constructor(
    @InjectRepository(Slot)
    private slotRepository: Repository<Slot>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
  ) {}

  async createSlot(createSlotDto: CreateSlotDto) {
    const teacher = await this.teacherRepository.findOne({
      where: { email: createSlotDto.teacher_id },
    });
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const slotExists = await this.slotRepository.findOne({
      where: {
        start_time: createSlotDto.start_time,
        teacher_id: teacher,
        date: createSlotDto.date,
      },
    });

    if (slotExists) {
      throw new BadRequestException('Slot already exists');
    }
    const newSlot = this.slotRepository.create({
      ...createSlotDto,
      teacher_id: teacher,
    });
    await this.slotRepository.save(newSlot);
    return {
      slot_id: newSlot.id,
      teacher_id: teacher.email,
      start_time: newSlot.start_time,
      duration: newSlot.duration,
    };
  }

  async getAllSlots() {
    return await this.slotRepository.find();
  }

  async getSlotById(id: number) {
    const slot = await this.slotRepository.findOne({ where: { id: id } });
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }
    return slot;
  }

  async getSlotsByEmail(email: string) {
    const teacher = await this.teacherRepository.findOne({
      where: { email },
      relations: ['slots'],
    });
    if (!teacher) {
      throw new NotFoundException("Teacher doesn't exist");
    }
    return teacher.slots;
  }

  async updateSlot(id: number, updateSlotDto: UpdateSlotDto) {
    const slot = await this.slotRepository.findOneBy({ id });
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }
    const teacher = await this.teacherRepository.findOne({
      where: { email: updateSlotDto.teacher_id },
    });
    if (!teacher) {
      throw new NotFoundException("Teacher doesn't exist");
    }
    Object.assign(slot, updateSlotDto);
    return this.slotRepository.save(slot);
  }

  async deleteSlot(id: number) {
    const slot = await this.slotRepository.findOne({ where: { id: id } });
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }
    await this.slotRepository.remove(slot);
    return { message: `Your slot number ${id} deleted successfully` };
  }
}
