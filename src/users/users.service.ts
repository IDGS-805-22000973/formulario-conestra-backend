import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    // Utilizado por el Authservice
    async findOneByEmail(correo: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { correo, deletedAt: IsNull() }
        });
    }


    // CRUD: Crear usuario con contraseña encriptada
    async create(createUserDto: CreateUserDto) {
        const { correo, password } = createUserDto;

        // Verificar si el correo ya existe
        const exists = await this.findOneByEmail(correo);
        if (exists) throw new ConflictException('El correo ya está registrado');

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password || '123456', salt); // Pass por defecto si no envían

        const newUser = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });

        return this.usersRepository.save(newUser);
    }

    // CRUD: Listar todos (Para el Admin)
    async findAll() {
        return this.usersRepository.find({
            where: { deletedAt: IsNull() },
            select: ['id', 'nombre', 'correo', 'edad', 'sexo', 'role'],
        });
    }



    // CRUD: Buscar un usuario por ID
    async findOne(id: number): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { id, deletedAt: IsNull() },
            select: ['id', 'nombre', 'correo', 'edad', 'sexo', 'role'] as (keyof User)[],
        });
    }


    // CRUD: Eliminar
    async remove(id: number) {
        return this.usersRepository.softDelete(id);
    }


    // CRUD: Restaurar
    async restore(id: number) {
        return this.usersRepository.restore(id);
    }




    async findDeleted() {
        return this.usersRepository.find({
            withDeleted: true,
            where: {
                deletedAt: Not(IsNull()),
            },
            select: ['id', 'nombre', 'correo', 'edad', 'sexo', 'role', 'deletedAt'],
        });
    }




}