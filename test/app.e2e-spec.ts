import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('School API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /school/teacher-hours', () => {
    it('should return teacher hours data', () => {
      return request(app.getHttpServer())
        .get('/school/teacher-hours')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('teacher_id');
            expect(res.body[0]).toHaveProperty('teacher_name');
            expect(res.body[0]).toHaveProperty('total_classes');
            expect(res.body[0]).toHaveProperty('total_hours');
            expect(res.body[0].teacher_id).toBeDefined();
            expect(typeof res.body[0].teacher_name).toBe('string');
            expect(res.body[0].total_classes).toBeDefined();
            expect(res.body[0].total_hours).toBeDefined();
          }
        });
    });

    it('should return valid data structure for teacher hours', () => {
      return request(app.getHttpServer())
        .get('/school/teacher-hours')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((teacher: any) => {
            expect(teacher).toHaveProperty('teacher_id');
            expect(teacher).toHaveProperty('teacher_name');
            expect(teacher).toHaveProperty('total_classes');
            expect(teacher).toHaveProperty('total_hours');
            expect(teacher.teacher_name).toMatch(/^Professor \d+$/);
            expect(Number(teacher.total_classes)).toBeGreaterThanOrEqual(0);
            expect(Number(teacher.total_hours)).toBeGreaterThanOrEqual(0);
          });
        });
    });

    it('should handle empty results gracefully', () => {
      return request(app.getHttpServer())
        .get('/school/teacher-hours')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('GET /school/room-schedules', () => {
    it('should return room schedules data', () => {
      return request(app.getHttpServer())
        .get('/school/room-schedules')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('room_id');
            expect(res.body[0]).toHaveProperty('room_name');
            expect(res.body[0]).toHaveProperty('building_name');
            expect(res.body[0]).toHaveProperty('occupied_schedules');
            expect(res.body[0]).toHaveProperty('free_schedules');
            expect(Array.isArray(res.body[0].occupied_schedules)).toBe(true);
            expect(Array.isArray(res.body[0].free_schedules)).toBe(true);
          }
        });
    });

    it('should return valid data structure for room schedules', () => {
      return request(app.getHttpServer())
        .get('/school/room-schedules')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((room: any) => {
            expect(room).toHaveProperty('room_id');
            expect(room).toHaveProperty('room_name');
            expect(room).toHaveProperty('building_name');
            expect(room).toHaveProperty('occupied_schedules');
            expect(room).toHaveProperty('free_schedules');
            expect(typeof room.room_id).toBe('number');
            expect(typeof room.room_name).toBe('string');
            expect(typeof room.building_name).toBe('string');
            expect(room.room_name).toMatch(/^Sala \d+$/);

            // Validate occupied schedules structure
            room.occupied_schedules.forEach((schedule: any) => {
              expect(schedule).toHaveProperty('day_of_week');
              expect(schedule).toHaveProperty('start_time');
              expect(schedule).toHaveProperty('end_time');
              expect(schedule).toHaveProperty('subject');
              expect(schedule).toHaveProperty('class_code');
              expect(typeof schedule.day_of_week).toBe('number');
              expect(schedule.day_of_week).toBeGreaterThanOrEqual(1);
              expect(schedule.day_of_week).toBeLessThanOrEqual(5);
            });

            // Validate free schedules structure
            room.free_schedules.forEach((slot: any) => {
              expect(slot).toHaveProperty('day_of_week');
              expect(slot).toHaveProperty('time_slot');
              expect(typeof slot.day_of_week).toBe('number');
              expect(typeof slot.time_slot).toBe('string');
              expect(slot.day_of_week).toBeGreaterThanOrEqual(1);
              expect(slot.day_of_week).toBeLessThanOrEqual(5);
              expect(['08:00', '10:00', '14:00', '16:00']).toContain(slot.time_slot);
            });
          });
        });
    });

    it('should handle empty results gracefully', () => {
      return request(app.getHttpServer())
        .get('/school/room-schedules')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should return consistent data for multiple rooms', () => {
      return request(app.getHttpServer())
        .get('/school/room-schedules')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);

          // If there are multiple rooms, they should have different IDs
          const roomIds = res.body.map((room: any) => room.room_id);
          const uniqueRoomIds = [...new Set(roomIds)];
          expect(roomIds.length).toBe(uniqueRoomIds.length);

          // Each room should have a unique name
          const roomNames = res.body.map((room: any) => room.room_name);
          const uniqueRoomNames = [...new Set(roomNames)];
          expect(roomNames.length).toBe(uniqueRoomNames.length);
        });
    });

    it('should validate time slot logic', () => {
      return request(app.getHttpServer())
        .get('/school/room-schedules')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);

          res.body.forEach((room: any) => {
            // Check that free schedules don't overlap with occupied schedules
            room.free_schedules.forEach((freeSlot: any) => {
              const isOverlapping = room.occupied_schedules.some((occupied: any) => {
                return occupied.day_of_week === freeSlot.day_of_week &&
                       occupied.start_time <= freeSlot.time_slot &&
                       occupied.end_time > freeSlot.time_slot;
              });
              expect(isOverlapping).toBe(false);
            });
          });
        });
    });
  });

  describe('Error handling', () => {
    it('should return 404 for non-existent endpoints', () => {
      return request(app.getHttpServer())
        .get('/school/non-existent')
        .expect(404);
    });

    it('should return 404 for wrong HTTP methods', () => {
      return request(app.getHttpServer())
        .post('/school/teacher-hours')
        .expect(404);
    });
  });
});
