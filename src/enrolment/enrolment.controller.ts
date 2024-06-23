import { Controller, UseGuards } from '@nestjs/common';
import { EnrolmentService } from './enrolment.service';
import { RolesGuard } from 'src/guards/role.guard';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('enrolment')
export class EnrolmentController {
  constructor(private enrolmentService: EnrolmentService) {}
}