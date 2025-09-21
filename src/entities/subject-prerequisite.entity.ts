import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Subject } from './subject.entity';
import { ClassSchedule } from './class-schedule.entity';

@Entity('subject_prerequisites')
export class SubjectPrerequisite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  subject_id: number;

  @Column({ type: 'int' })
  prerequisite_id: number;

  @ManyToOne(() => Subject)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @ManyToOne(() => ClassSchedule)
  @JoinColumn({ name: 'prerequisite_id' })
  prerequisite: ClassSchedule;
}
