import { Test, TestingModule } from '@nestjs/testing';
import { SchoolController } from './school.controller';
import { SchoolService } from '../services/school.service';

describe('SchoolController', () => {
  let controller: SchoolController;
  let service: SchoolService;

  const mockSchoolService = {
    getTeacherHours: jest.fn(),
    getRoomSchedules: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolController],
      providers: [
        {
          provide: SchoolService,
          useValue: mockSchoolService,
        },
      ],
    }).compile();

    controller = module.get<SchoolController>(SchoolController);
    service = module.get<SchoolService>(SchoolService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTeacherHours', () => {
    it('should return teacher hours data', async () => {
      const mockTeacherHours = [
        {
          teacher_id: 1,
          teacher_name: 'Professor 1',
          total_classes: 5,
          total_hours: 10.5,
        },
        {
          teacher_id: 2,
          teacher_name: 'Professor 2',
          total_classes: 3,
          total_hours: 6.0,
        },
      ];

      mockSchoolService.getTeacherHours.mockResolvedValue(mockTeacherHours);

      const result = await controller.getTeacherHours();

      expect(service.getTeacherHours).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockTeacherHours);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockSchoolService.getTeacherHours.mockRejectedValue(error);

      await expect(controller.getTeacherHours()).rejects.toThrow('Service error');
      expect(service.getTeacherHours).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no data', async () => {
      mockSchoolService.getTeacherHours.mockResolvedValue([]);

      const result = await controller.getTeacherHours();

      expect(result).toEqual([]);
      expect(service.getTeacherHours).toHaveBeenCalledTimes(1);
    });
  });

  describe('getRoomSchedules', () => {
    it('should return room schedules data', async () => {
      const mockRoomSchedules = [
        {
          room_id: 1,
          room_name: 'Sala 1',
          building_name: 'Prédio A',
          occupied_schedules: [
            {
              day_of_week: 1,
              start_time: '08:00',
              end_time: '10:00',
              subject: 'Matemática',
              class_code: 'MAT101',
            },
          ],
          free_schedules: [
            { day_of_week: 1, time_slot: '10:00' },
            { day_of_week: 1, time_slot: '14:00' },
            { day_of_week: 1, time_slot: '16:00' },
          ],
        },
      ];

      mockSchoolService.getRoomSchedules.mockResolvedValue(mockRoomSchedules);

      const result = await controller.getRoomSchedules();

      expect(service.getRoomSchedules).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockRoomSchedules);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockSchoolService.getRoomSchedules.mockRejectedValue(error);

      await expect(controller.getRoomSchedules()).rejects.toThrow('Service error');
      expect(service.getRoomSchedules).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no rooms', async () => {
      mockSchoolService.getRoomSchedules.mockResolvedValue([]);

      const result = await controller.getRoomSchedules();

      expect(result).toEqual([]);
      expect(service.getRoomSchedules).toHaveBeenCalledTimes(1);
    });

    it('should handle complex room schedule data', async () => {
      const mockComplexRoomSchedules = [
        {
          room_id: 1,
          room_name: 'Sala 1',
          building_name: 'Prédio A',
          occupied_schedules: [
            {
              day_of_week: 1,
              start_time: '08:00',
              end_time: '10:00',
              subject: 'Matemática',
              class_code: 'MAT101',
            },
            {
              day_of_week: 2,
              start_time: '14:00',
              end_time: '16:00',
              subject: 'Física',
              class_code: 'FIS101',
            },
          ],
          free_schedules: [
            { day_of_week: 1, time_slot: '10:00' },
            { day_of_week: 1, time_slot: '14:00' },
            { day_of_week: 1, time_slot: '16:00' },
            { day_of_week: 2, time_slot: '08:00' },
            { day_of_week: 2, time_slot: '10:00' },
            { day_of_week: 2, time_slot: '16:00' },
          ],
        },
        {
          room_id: 2,
          room_name: 'Sala 2',
          building_name: 'Prédio B',
          occupied_schedules: [],
          free_schedules: Array.from({ length: 20 }, (_, i) => ({
            day_of_week: Math.floor(i / 4) + 1,
            time_slot: ['08:00', '10:00', '14:00', '16:00'][i % 4],
          })),
        },
      ];

      mockSchoolService.getRoomSchedules.mockResolvedValue(mockComplexRoomSchedules);

      const result = await controller.getRoomSchedules();

      expect(result).toHaveLength(2);
      expect(result[0].occupied_schedules).toHaveLength(2);
      expect(result[1].occupied_schedules).toHaveLength(0);
      expect(result[1].free_schedules).toHaveLength(20);
    });
  });
});