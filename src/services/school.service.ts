import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from '../entities/teacher.entity';
import { ClassSchedule } from '../entities/class-schedule.entity';
import { Room } from '../entities/room.entity';
import { Building } from '../entities/building.entity';
import { Subject } from '../entities/subject.entity';
import { Class } from '../entities/class.entity';

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(ClassSchedule)
    private readonly classScheduleRepository: Repository<ClassSchedule>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async getTeacherHours() {
    const query = `
      SELECT
        t.id as teacher_id,
        CONCAT('Professor ', t.id) as teacher_name,
        COUNT(cs.id) as total_classes,
        SUM(
          EXTRACT(EPOCH FROM (cs.end_time::time - cs.start_time::time)) / 3600
        ) as total_hours
      FROM teachers t
      LEFT JOIN subjects s ON s.teacher_id = t.id
      LEFT JOIN classes c ON c.subject_id = s.id
      LEFT JOIN class_schedules cs ON cs.class_id = c.id
      GROUP BY t.id
      ORDER BY t.id;
    `;

    return this.teacherRepository.query(query);
  }

  async getRoomSchedules() {
    // Buscar todas as salas com seus prédios
    const rooms = await this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.building', 'building')
      .getMany();

    // Buscar todos os horários ocupados
    const occupiedSchedules = await this.classScheduleRepository
      .createQueryBuilder('cs')
      .leftJoinAndSelect('cs.room', 'room')
      .leftJoinAndSelect('cs.class', 'class')
      .leftJoinAndSelect('class.subject', 'subject')
      .getMany();

    // Gerar horários livres (assumindo horário de funcionamento: 8h às 18h, segunda a sexta)
    const workingHours = ['08:00', '10:00', '14:00', '16:00'];
    const workingDays = [1, 2, 3, 4, 5]; // Segunda a sexta

    const result = rooms.map((room) => {
      const occupied = occupiedSchedules
        .filter((cs) => cs.room_id === room.id)
        .map((cs) => ({
          day_of_week: cs.day_of_week,
          start_time: cs.start_time,
          end_time: cs.end_time,
          subject: cs.class.subject.name,
          class_code: cs.class.code,
        }));

      // Gerar horários livres
      const freeSlots: { day_of_week: number; time_slot: string }[] = [];
      workingDays.forEach((day) => {
        workingHours.forEach((hour) => {
          const isOccupied = occupied.some(
            (occ) =>
              occ.day_of_week === day &&
              occ.start_time <= hour &&
              occ.end_time > hour,
          );

          if (!isOccupied) {
            freeSlots.push({
              day_of_week: day,
              time_slot: hour,
            });
          }
        });
      });

      return {
        room_id: room.id,
        room_name: `Sala ${room.id}`,
        building_name: room.building.name,
        occupied_schedules: occupied,
        free_schedules: freeSlots,
      };
    });

    return result;
  }
}
