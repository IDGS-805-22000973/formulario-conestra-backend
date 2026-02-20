// src/test-engine/test-engine.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestResponse } from '../entities/test-response.entity';
import { User } from '../entities/user.entity';
import { calculateMoss } from './formulas/moss.logic';
import { calculate16PF } from './formulas/pf16.logic'; // <--- IMPORTANTE

@Injectable()
export class TestEngineService {
    constructor(
        @InjectRepository(TestResponse)
        private responseRepo: Repository<TestResponse>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }

    async processTest(userId: number, testType: 'MOSS' | '16PF', answers: any) {
        // 1. Validar si ya respondió
        const alreadyResponded = await this.responseRepo.findOne({
            where: { user: { id: userId }, testType }
        });

        if (alreadyResponded) {
            throw new BadRequestException(`Ya has realizado el test ${testType} anteriormente.`);
        }

        // 2. Obtener usuario (NECESARIO para saber si es 'M' o 'F' en el 16PF)
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        // 3. Calcular resultados según el tipo
        let results;
        if (testType === 'MOSS') {
            results = calculateMoss(answers);
        } else if (testType === '16PF') {
            // Pasamos las respuestas y el sexo del usuario
            results = calculate16PF(answers, user.sexo);
        } else {
            throw new BadRequestException('Tipo de test no válido');
        }

        // 4. Guardar
        const newResponse = this.responseRepo.create({
            testType,
            answers, // Guardamos las respuestas crudas por seguridad
            calculatedResults: results, // Guardamos el resultado procesado
            user: { id: userId } // Relacionamos con el usuario (TypeORM maneja esto con el ID)
        });

        await this.responseRepo.save(newResponse);

        return {
            message: "Test enviado y calificado con éxito",
            results: results
        };
    }

    async findAllResults() {
        return this.responseRepo.find({
            relations: ['user'],
            order: { id: 'DESC' }
        });
    }

    async findResultsByUserId(userId: number) {
        return this.responseRepo.find({
            where: { user: { id: userId } },
            relations: ['user'],
            order: { id: 'DESC' },
        });
    }

}