import { Controller, Get } from '@nestjs/common';
import { SchoolService } from '../services/school.service';

@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get('teacher-hours')
  async getTeacherHours() {
    return this.schoolService.getTeacherHours();
  }

  @Get('room-schedules')
  async getRoomSchedules() {
    return this.schoolService.getRoomSchedules();
  }
}
