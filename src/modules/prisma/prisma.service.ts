import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        // 지금이 배포 상태인지 개발 상태인지 확인
        const isProduction = process.env.NODE_ENV === 'production';

        // 1. pg 패키지를 이용해 커넥션 풀(Pool)을 생성합니다. (환경변수 필수)
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });

        // 2. PrismaPg 어댑터에 방금 만든 풀을 주입합니다.
        const adapter = new PrismaPg(pool);

        super({
            adapter,
            log: isProduction
                ? ['warn', 'error']
                : ['query', 'info', 'warn', 'error'],
        });
    }
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
}