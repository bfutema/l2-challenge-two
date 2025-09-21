import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchoolController } from './controllers/school.controller';
import { SchoolService } from './services/school.service';
import { Department } from './entities/department.entity';
import { Title } from './entities/title.entity';
import { Teacher } from './entities/teacher.entity';
import { Building } from './entities/building.entity';
import { Room } from './entities/room.entity';
import { Subject } from './entities/subject.entity';
import { Class } from './entities/class.entity';
import { ClassSchedule } from './entities/class-schedule.entity';
import { SubjectPrerequisite } from './entities/subject-prerequisite.entity';
import { envConfig } from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => envConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envConfig.DB_HOST,
      port: envConfig.DB_PORT,
      username: envConfig.DB_USERNAME,
      password: envConfig.DB_PASSWORD,
      database: envConfig.DB_NAME,
      entities: [Department, Title, Teacher, Building, Room, Subject, Class, ClassSchedule, SubjectPrerequisite],
      synchronize: true,
      logging: envConfig.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([Department, Title, Teacher, Building, Room, Subject, Class, ClassSchedule, SubjectPrerequisite]),
  ],
  controllers: [AppController, SchoolController],
  providers: [AppService, SchoolService],
})
export class AppModule {}
