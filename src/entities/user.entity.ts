import { Entity, Column, PrimaryColumn, OneToMany, ManyToOne, JoinColumn, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';
import { TestResponse } from './test-response.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({ unique: true })
    correo: string;

    @Column()
    password: string;

    @Column()
    edad: number;

    @Column()
    sexo: 'M' | 'F';

    @Column({ default: 'user' })
    role: string;

    @OneToMany(() => TestResponse, (res) => res.user)
    responses: TestResponse[];

    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;
}