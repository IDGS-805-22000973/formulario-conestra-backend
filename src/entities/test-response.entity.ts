import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class TestResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  testType: 'MOSS' | '16PF';

  @Column('jsonb')
  answers: any; // Guardamos el JSON de respuestas

  @Column('jsonb', { nullable: true })
  calculatedResults: any; // Guardamos el resultado final (decatipos/puntos)

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.responses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}