/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateSlotDto } from './createSlot.dto';

export class UpdateSlotDto extends PartialType(CreateSlotDto) {}
