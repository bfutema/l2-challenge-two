import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Subject } from './subject.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  subject_id: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int' })
  semester: number;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @ManyToOne(() => Subject)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;
}
