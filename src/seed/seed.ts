import { DataSource } from 'typeorm';
import { Department } from '../entities/department.entity';
import { Title } from '../entities/title.entity';
import { Teacher } from '../entities/teacher.entity';
import { Building } from '../entities/building.entity';
import { Room } from '../entities/room.entity';
import { Subject } from '../entities/subject.entity';
import { Class } from '../entities/class.entity';
import { ClassSchedule } from '../entities/class-schedule.entity';
import { SubjectPrerequisite } from '../entities/subject-prerequisite.entity';

export class Seed {
  constructor(private dataSource: DataSource) {}

  async run() {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Limpar dados existentes
    await this.clearData();

    // Criar dados
    const departments = await this.createDepartments();
    const titles = await this.createTitles();
    const teachers = await this.createTeachers(departments, titles);
    const buildings = await this.createBuildings();
    const rooms = await this.createRooms(buildings);
    const subjects = await this.createSubjects(teachers);
    const classes = await this.createClasses(subjects);
    const classSchedules = await this.createClassSchedules(classes, rooms);
    await this.createSubjectPrerequisites(subjects, classSchedules);

    console.log('✅ Seed concluído com sucesso!');
  }

  private async clearData() {
    console.log('🧹 Limpando dados existentes...');

    // Limpar tabelas na ordem correta usando TRUNCATE CASCADE
    const tables = [
      'subject_prerequisites',
      'class_schedules',
      'classes',
      'subjects',
      'rooms',
      'buildings',
      'teachers',
      'titles',
      'departments'
    ];

    for (const table of tables) {
      await this.dataSource.query(`TRUNCATE TABLE "${table}" CASCADE`);
    }
  }

  private async createDepartments(): Promise<Department[]> {
    console.log('📚 Criando departamentos...');

    const departments = [
      { name: 'Matemática' },
      { name: 'Física' },
      { name: 'Química' },
      { name: 'Biologia' },
      { name: 'História' },
      { name: 'Geografia' },
      { name: 'Português' },
      { name: 'Inglês' },
    ];

    const savedDepartments: Department[] = [];
    for (const dept of departments) {
      const department = this.dataSource.getRepository(Department).create(dept);
      const saved: any = await this.dataSource
        .getRepository(Department)
        .save(department);
      savedDepartments.push(saved);
    }

    return savedDepartments;
  }

  private async createTitles(): Promise<Title[]> {
    console.log('🎓 Criando títulos...');

    const titles = [
      { name: 'Professor' },
      { name: 'Professor Doutor' },
      { name: 'Professor Mestre' },
      { name: 'Professor Especialista' },
    ];

    const savedTitles: Title[] = [];
    for (const title of titles) {
      const titleEntity = this.dataSource.getRepository(Title).create(title);
      const saved: any = await this.dataSource
        .getRepository(Title)
        .save(titleEntity);
      savedTitles.push(saved);
    }

    return savedTitles;
  }

  private async createTeachers(
    departments: Department[],
    titles: Title[],
  ): Promise<Teacher[]> {
    console.log('👨‍🏫 Criando professores...');

    const teachers = [
      { department_id: departments[0].id, title_id: titles[0].id }, // Matemática - Professor
      { department_id: departments[1].id, title_id: titles[1].id }, // Física - Professor Doutor
      { department_id: departments[2].id, title_id: titles[2].id }, // Química - Professor Mestre
      { department_id: departments[3].id, title_id: titles[0].id }, // Biologia - Professor
      { department_id: departments[4].id, title_id: titles[3].id }, // História - Professor Especialista
      { department_id: departments[5].id, title_id: titles[0].id }, // Geografia - Professor
      { department_id: departments[6].id, title_id: titles[1].id }, // Português - Professor Doutor
      { department_id: departments[7].id, title_id: titles[2].id }, // Inglês - Professor Mestre
    ];

    const savedTeachers: Teacher[] = [];
    for (const teacher of teachers) {
      const teacherEntity = this.dataSource
        .getRepository(Teacher)
        .create(teacher);
      const saved: any = await this.dataSource
        .getRepository(Teacher)
        .save(teacherEntity);
      savedTeachers.push(saved);
    }

    return savedTeachers;
  }

  private async createBuildings(): Promise<Building[]> {
    console.log('🏢 Criando prédios...');

    const buildings = [
      { name: 'Prédio A - Ciências Exatas' },
      { name: 'Prédio B - Ciências Humanas' },
      { name: 'Prédio C - Laboratórios' },
      { name: 'Prédio D - Biblioteca' },
    ];

    const savedBuildings: Building[] = [];
    for (const building of buildings) {
      const buildingEntity = this.dataSource
        .getRepository(Building)
        .create(building);
      const saved: any = await this.dataSource
        .getRepository(Building)
        .save(buildingEntity);
      savedBuildings.push(saved);
    }

    return savedBuildings;
  }

  private async createRooms(buildings: Building[]): Promise<Room[]> {
    console.log('🚪 Criando salas...');

    const rooms = [
      { building_id: buildings[0].id }, // Prédio A
      { building_id: buildings[0].id },
      { building_id: buildings[0].id },
      { building_id: buildings[1].id }, // Prédio B
      { building_id: buildings[1].id },
      { building_id: buildings[2].id }, // Prédio C
      { building_id: buildings[2].id },
      { building_id: buildings[3].id }, // Prédio D
    ];

    const savedRooms: Room[] = [];
    for (const room of rooms) {
      const roomEntity = this.dataSource.getRepository(Room).create(room);
      const saved = await this.dataSource.getRepository(Room).save(roomEntity);
      savedRooms.push(saved);
    }

    return savedRooms;
  }

  private async createSubjects(teachers: Teacher[]): Promise<Subject[]> {
    console.log('📖 Criando matérias...');

    const subjects = [
      { teacher_id: teachers[0].id, code: 'MAT101', name: 'Álgebra Linear' },
      { teacher_id: teachers[0].id, code: 'MAT102', name: 'Cálculo I' },
      { teacher_id: teachers[1].id, code: 'FIS101', name: 'Física I' },
      { teacher_id: teachers[1].id, code: 'FIS102', name: 'Física II' },
      { teacher_id: teachers[2].id, code: 'QUI101', name: 'Química Geral' },
      { teacher_id: teachers[3].id, code: 'BIO101', name: 'Biologia Celular' },
      {
        teacher_id: teachers[4].id,
        code: 'HIS101',
        name: 'História do Brasil',
      },
      { teacher_id: teachers[5].id, code: 'GEO101', name: 'Geografia Física' },
      {
        teacher_id: teachers[6].id,
        code: 'POR101',
        name: 'Literatura Brasileira',
      },
      { teacher_id: teachers[7].id, code: 'ING101', name: 'Inglês Básico' },
    ];

    const savedSubjects: Subject[] = [];
    for (const subject of subjects) {
      const subjectEntity = this.dataSource
        .getRepository(Subject)
        .create(subject);
      const saved = await this.dataSource
        .getRepository(Subject)
        .save(subjectEntity);
      savedSubjects.push(saved);
    }

    return savedSubjects;
  }

  private async createClasses(subjects: Subject[]): Promise<Class[]> {
    console.log('🎒 Criando turmas...');

    const classes = [
      {
        subject_id: subjects[0].id,
        year: 2024,
        semester: 1,
        code: 'MAT101-2024-1',
      },
      {
        subject_id: subjects[1].id,
        year: 2024,
        semester: 1,
        code: 'MAT102-2024-1',
      },
      {
        subject_id: subjects[2].id,
        year: 2024,
        semester: 1,
        code: 'FIS101-2024-1',
      },
      {
        subject_id: subjects[3].id,
        year: 2024,
        semester: 2,
        code: 'FIS102-2024-2',
      },
      {
        subject_id: subjects[4].id,
        year: 2024,
        semester: 1,
        code: 'QUI101-2024-1',
      },
      {
        subject_id: subjects[5].id,
        year: 2024,
        semester: 1,
        code: 'BIO101-2024-1',
      },
      {
        subject_id: subjects[6].id,
        year: 2024,
        semester: 1,
        code: 'HIS101-2024-1',
      },
      {
        subject_id: subjects[7].id,
        year: 2024,
        semester: 2,
        code: 'GEO101-2024-2',
      },
      {
        subject_id: subjects[8].id,
        year: 2024,
        semester: 1,
        code: 'POR101-2024-1',
      },
      {
        subject_id: subjects[9].id,
        year: 2024,
        semester: 1,
        code: 'ING101-2024-1',
      },
    ];

    const savedClasses: Class[] = [];
    for (const classData of classes) {
      const classEntity = this.dataSource
        .getRepository(Class)
        .create(classData);
      const saved = await this.dataSource
        .getRepository(Class)
        .save(classEntity);
      savedClasses.push(saved);
    }

    return savedClasses;
  }

  private async createClassSchedules(
    classes: Class[],
    rooms: Room[],
  ): Promise<ClassSchedule[]> {
    console.log('⏰ Criando horários das aulas...');

    const schedules = [
      {
        class_id: classes[0].id,
        room_id: rooms[0].id,
        day_of_week: 1,
        start_time: '08:00',
        end_time: '10:00',
      }, // Segunda - Álgebra
      {
        class_id: classes[0].id,
        room_id: rooms[0].id,
        day_of_week: 3,
        start_time: '08:00',
        end_time: '10:00',
      }, // Quarta - Álgebra
      {
        class_id: classes[1].id,
        room_id: rooms[1].id,
        day_of_week: 2,
        start_time: '10:00',
        end_time: '12:00',
      }, // Terça - Cálculo
      {
        class_id: classes[1].id,
        room_id: rooms[1].id,
        day_of_week: 4,
        start_time: '10:00',
        end_time: '12:00',
      }, // Quinta - Cálculo
      {
        class_id: classes[2].id,
        room_id: rooms[2].id,
        day_of_week: 1,
        start_time: '14:00',
        end_time: '16:00',
      }, // Segunda - Física I
      {
        class_id: classes[2].id,
        room_id: rooms[2].id,
        day_of_week: 3,
        start_time: '14:00',
        end_time: '16:00',
      }, // Quarta - Física I
      {
        class_id: classes[3].id,
        room_id: rooms[3].id,
        day_of_week: 2,
        start_time: '16:00',
        end_time: '18:00',
      }, // Terça - Física II
      {
        class_id: classes[4].id,
        room_id: rooms[4].id,
        day_of_week: 5,
        start_time: '08:00',
        end_time: '10:00',
      }, // Sexta - Química
      {
        class_id: classes[5].id,
        room_id: rooms[5].id,
        day_of_week: 1,
        start_time: '10:00',
        end_time: '12:00',
      }, // Segunda - Biologia
      {
        class_id: classes[6].id,
        room_id: rooms[6].id,
        day_of_week: 3,
        start_time: '16:00',
        end_time: '18:00',
      }, // Quarta - História
      {
        class_id: classes[7].id,
        room_id: rooms[7].id,
        day_of_week: 4,
        start_time: '14:00',
        end_time: '16:00',
      }, // Quinta - Geografia
      {
        class_id: classes[8].id,
        room_id: rooms[0].id,
        day_of_week: 2,
        start_time: '14:00',
        end_time: '16:00',
      }, // Terça - Português
      {
        class_id: classes[9].id,
        room_id: rooms[1].id,
        day_of_week: 5,
        start_time: '10:00',
        end_time: '12:00',
      }, // Sexta - Inglês
    ];

    const savedSchedules: ClassSchedule[] = [];
    for (const schedule of schedules) {
      const scheduleEntity = this.dataSource
        .getRepository(ClassSchedule)
        .create(schedule);
      const saved = await this.dataSource
        .getRepository(ClassSchedule)
        .save(scheduleEntity);
      savedSchedules.push(saved);
    }

    return savedSchedules;
  }

  private async createSubjectPrerequisites(
    subjects: Subject[],
    classSchedules: ClassSchedule[],
  ): Promise<void> {
    console.log('🔗 Criando pré-requisitos...');

    const prerequisites = [
      { subject_id: subjects[1].id, prerequisite_id: classSchedules[0].id }, // Cálculo I precisa de Álgebra Linear
      { subject_id: subjects[3].id, prerequisite_id: classSchedules[4].id }, // Física II precisa de Física I
    ];

    for (const prereq of prerequisites) {
      const prereqEntity = this.dataSource
        .getRepository(SubjectPrerequisite)
        .create(prereq);
      await this.dataSource
        .getRepository(SubjectPrerequisite)
        .save(prereqEntity);
    }
  }
}
