import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchoolService } from './school.service';
import { Teacher } from '../entities/teacher.entity';
import { ClassSchedule } from '../entities/class-schedule.entity';
import { Room } from '../entities/room.entity';
import { Building } from '../entities/building.entity';
import { Subject } from '../entities/subject.entity';
import { Class } from '../entities/class.entity';

describe('SchoolService', () => {
  let service: SchoolService;
  let teacherRepository: Repository<Teacher>;
  let classScheduleRepository: Repository<ClassSchedule>;
  let roomRepository: Repository<Room>;
  let buildingRepository: Repository<Building>;
  let subjectRepository: Repository<Subject>;
  let classRepository: Repository<Class>;

  const mockTeacherRepository = {
    query: jest.fn(),
  };

  const mockClassScheduleRepository = {
    createQueryBuilder: jest.fn(),
  };

  const mockRoomRepository = {
    createQueryBuilder: jest.fn(),
  };

  const mockBuildingRepository = {
    createQueryBuilder: jest.fn(),
  };

  const mockSubjectRepository = {
    createQueryBuilder: jest.fn(),
  };

  const mockClassRepository = {
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolService,
        {
          provide: getRepositoryToken(Teacher),
          useValue: mockTeacherRepository,
        },
        {
          provide: getRepositoryToken(ClassSchedule),
          useValue: mockClassScheduleRepository,
        },
        {
          provide: getRepositoryToken(Room),
          useValue: mockRoomRepository,
        },
        {
          provide: getRepositoryToken(Building),
          useValue: mockBuildingRepository,
        },
        {
          provide: getRepositoryToken(Subject),
          useValue: mockSubjectRepository,
        },
        {
          provide: getRepositoryToken(Class),
          useValue: mockClassRepository,
        },
      ],
    }).compile();

    service = module.get<SchoolService>(SchoolService);
    teacherRepository = module.get<Repository<Teacher>>(
      getRepositoryToken(Teacher),
    );
    classScheduleRepository = module.get<Repository<ClassSchedule>>(
      getRepositoryToken(ClassSchedule),
    );
    roomRepository = module.get<Repository<Room>>(getRepositoryToken(Room));
    buildingRepository = module.get<Repository<Building>>(
      getRepositoryToken(Building),
    );
    subjectRepository = module.get<Repository<Subject>>(
      getRepositoryToken(Subject),
    );
    classRepository = module.get<Repository<Class>>(getRepositoryToken(Class));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      mockTeacherRepository.query.mockResolvedValue(mockTeacherHours);

      const result = await service.getTeacherHours();

      expect(mockTeacherRepository.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
      );
      expect(result).toEqual(mockTeacherHours);
    });

    it('should handle empty results', async () => {
      mockTeacherRepository.query.mockResolvedValue([]);

      const result = await service.getTeacherHours();

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      mockTeacherRepository.query.mockRejectedValue(error);

      await expect(service.getTeacherHours()).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('getRoomSchedules', () => {
    it('should return room schedules with occupied and free slots', async () => {
      const mockRooms = [
        {
          id: 1,
          building: { name: 'Prédio A' },
        },
        {
          id: 2,
          building: { name: 'Prédio B' },
        },
      ];

      const mockOccupiedSchedules = [
        {
          room_id: 1,
          day_of_week: 1,
          start_time: '08:00',
          end_time: '10:00',
          class: {
            subject: { name: 'Matemática' },
            code: 'MAT101',
          },
        },
        {
          room_id: 1,
          day_of_week: 1,
          start_time: '14:00',
          end_time: '16:00',
          class: {
            subject: { name: 'Física' },
            code: 'FIS101',
          },
        },
      ];

      const mockRoomQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockRooms),
      };

      const mockScheduleQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockOccupiedSchedules),
      };

      mockRoomRepository.createQueryBuilder.mockReturnValue(
        mockRoomQueryBuilder,
      );
      mockClassScheduleRepository.createQueryBuilder.mockReturnValue(
        mockScheduleQueryBuilder,
      );

      const result = await service.getRoomSchedules();

      expect(mockRoomRepository.createQueryBuilder).toHaveBeenCalledWith(
        'room',
      );
      expect(
        mockClassScheduleRepository.createQueryBuilder,
      ).toHaveBeenCalledWith('cs');
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('room_id', 1);
      expect(result[0]).toHaveProperty('room_name', 'Sala 1');
      expect(result[0]).toHaveProperty('building_name', 'Prédio A');
      expect(result[0]).toHaveProperty('occupied_schedules');
      expect(result[0]).toHaveProperty('free_schedules');
    });

    it('should handle rooms with no occupied schedules', async () => {
      const mockRooms = [
        {
          id: 1,
          building: { name: 'Prédio A' },
        },
      ];

      const mockRoomQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockRooms),
      };

      const mockScheduleQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockRoomRepository.createQueryBuilder.mockReturnValue(
        mockRoomQueryBuilder,
      );
      mockClassScheduleRepository.createQueryBuilder.mockReturnValue(
        mockScheduleQueryBuilder,
      );

      const result = await service.getRoomSchedules();

      expect(result).toHaveLength(1);
      expect(result[0].occupied_schedules).toEqual([]);
      expect(result[0].free_schedules).toHaveLength(20); // 5 days * 4 time slots
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      const mockRoomQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockRejectedValue(error),
      };

      mockRoomRepository.createQueryBuilder.mockReturnValue(
        mockRoomQueryBuilder,
      );

      await expect(service.getRoomSchedules()).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should correctly identify free time slots', async () => {
      const mockRooms = [
        {
          id: 1,
          building: { name: 'Prédio A' },
        },
      ];

      const mockOccupiedSchedules = [
        {
          room_id: 1,
          day_of_week: 1, // Monday
          start_time: '08:00',
          end_time: '10:00',
          class: {
            subject: { name: 'Matemática' },
            code: 'MAT101',
          },
        },
      ];

      const mockRoomQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockRooms),
      };

      const mockScheduleQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockOccupiedSchedules),
      };

      mockRoomRepository.createQueryBuilder.mockReturnValue(
        mockRoomQueryBuilder,
      );
      mockClassScheduleRepository.createQueryBuilder.mockReturnValue(
        mockScheduleQueryBuilder,
      );

      const result = await service.getRoomSchedules();

      const mondayFreeSlots = result[0].free_schedules.filter(
        (slot) => slot.day_of_week === 1,
      );

      // Monday should have 3 free slots (10:00, 14:00, 16:00) since 08:00-10:00 is occupied
      expect(mondayFreeSlots).toHaveLength(3);
      expect(mondayFreeSlots.map((slot) => slot.time_slot)).toEqual([
        '10:00',
        '14:00',
        '16:00',
      ]);
    });
  });
});
