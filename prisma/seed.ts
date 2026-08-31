import 'dotenv/config'; // .env 파일의 환경변수를 자동으로 로드
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('더미 데이터 Seeding 시작...');

    // 1. 작성자로 쓸 더미 유저 생성
    const user = await prisma.user.upsert({
        where: {
            provider_providerId: {
                provider: 'seed',
                providerId: 'seed-test-user-2'
            }
        },
        update: {},
        create: {
            provider: 'seed',
            providerId: 'seed-test-user-2',
            nickname: '개발자',
        },
    });

    console.log(`더미 유저 생성 완료: ${user.id}`);

    // 2. 만료 시간 설정
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await prisma.drop.createMany({
        data: [
            {
                content: '이 동네도 꽤 살기 좋네요!',
                latitude: 37.5384602, // 정중앙
                longitude: 126.8400670,
                authorId: user.id,
                likeCount: 5,
                dislikeCount: 1,
                commentCount: 2,
                expiresAt,
            },
            {
                content: '집 가는 길에 고양이 발견 ',
                latitude: 37.5385602, // 북동쪽으로 약 10m
                longitude: 126.8401670,
                authorId: user.id,
                likeCount: 15,
                dislikeCount: 2,
                commentCount: 0,
                expiresAt,
            },
            {
                content: '야식으로 치킨 시킬까 말까 고민중...',
                latitude: 37.5383602, // 남서쪽으로 약 10m
                longitude: 126.8399670,
                authorId: user.id,
                likeCount: 0,
                dislikeCount: 0,
                commentCount: 4,
                expiresAt,
            }
        ]
    });

    console.log('요청하신 좌표 주변 더미 DROP 3개 생성 완료!');
}

main()
    .catch((e) => {
        console.error('시드 데이터 삽입 중 에러 발생:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });