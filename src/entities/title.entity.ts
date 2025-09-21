import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('titles')
export class Title {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;
}
