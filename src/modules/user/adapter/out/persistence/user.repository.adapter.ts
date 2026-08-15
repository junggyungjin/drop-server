import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { UserRepositoryPort } from "src/modules/user/application/port/out/user.repository.port";
import { User, UserStatus } from "src/modules/user/domain/user.entity";
import { User as PrismaUser } from '@prisma/client';

@Injectable()
export class UserRepositoryAdapter implements UserRepositoryPort {

    constructor(private readonly prisma: PrismaService) { }

    // 1. Prisma 모델(DB 데이터) -> Domain 모델(Entity) 변환 매퍼
    // DB의 데이터를 도메인 계층이 이해할 수 있는 완벽한 객체로 복원합니다.
    private toDomain(record: PrismaUser): User {
        return User.from(
            record.id,
            record.provider,
            record.providerId,
            record.status as UserStatus,
            record.createdAt,
            record.updatedAt,
        );
    }

    // 2. 신규 유저 저장
    async save(user: User): Promise<User> {
        const record = await this.prisma.user.create({
            data: {
                id: user.id,
                provider: user.provider,
                providerId: user.providerId,
                status: user.status,
            },
        });
        return this.toDomain(record);
    }

    // 3. ID로 유저 조회
    async findById(id: string): Promise<User | null> {
        const record = await this.prisma.user.findUnique({
            where: { id },
        });
        return record ? this.toDomain(record) : null;
    }

    // 4. 소셜 정보로 유저 조회
    async findByProviderId(provider: string, providerId: string): Promise<User | null> {
        const record = await this.prisma.user.findUnique({
            // schema.prisma에 정의했던 복합 유니크 인덱스를 기반으로 조회합니다.
            where: {
                provider_providerId: {
                    provider,
                    providerId
                },
            },
        });
        return record ? this.toDomain(record) : null;
    }

}