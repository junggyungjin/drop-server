import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { DropRepositoryPort, NearbyDropProjection } from "src/modules/drop/application/port/out/drop.repository.port";
import { SaveDropPort } from "src/modules/drop/application/port/out/save-drop.port";
import { Drop } from "src/modules/drop/domain/drop.entity";

export type NearbyDropRawResult = {
    id: string;
    content: string;
    latitude: number;
    longitude: number;
    authorId: string;
    likeCount: number; // DB 드라이버에 따라 BigInt로 올 수 있음
    dislikeCount: number;
    commentCount: number;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    authorNickname: string;
    distance: number;
};

@Injectable()
export class DropRepositoryAdapter implements DropRepositoryPort, SaveDropPort {
    constructor(private readonly prisma: PrismaService) { }

    async findNearbyDrops(
        latitude: number,
        longitude: number,
        radius: number,
        limit?: number
    ): Promise<NearbyDropProjection[]> {

        // 공간 인덱스(GIST)를 완벽하게 타는 쿼리로 변경
        const rows = await this.prisma.$queryRaw<NearbyDropRawResult[]>`
            SELECT
                d.id,
                d.content,
                d.latitude, 
                d.longitude, 
                d.author_id AS "authorId", 
                d.like_count AS "likeCount", 
                d.dislike_count AS "dislikeCount", 
                d.comment_count AS "commentCount", 
                d.expires_at AS "expiresAt", 
                d.created_at AS "createdAt", 
                d.updated_at AS "updatedAt",
                u.nickname AS "authorNickname",

                -- SELECT 절에서는 정확한 거리 반환을 위해 ST_Distance 사용
                ST_Distance(
                    ST_MakePoint(d.longitude, d.latitude)::geography,
                    ST_MakePoint(${longitude}, ${latitude})::geography
                ) AS distance

            FROM drops d
            INNER JOIN users u ON d.author_id = u.id

            -- WHERE 절에는 반드시 ST_DWithin을 사용하여 공간 인덱스를 태워야 함
            WHERE ST_DWithin(
                ST_MakePoint(d.longitude, d.latitude)::geography,
                ST_MakePoint(${longitude}, ${latitude})::geography,
                ${radius}
            )
                AND d.expires_at > NOW()
            ORDER BY distance ASC
            LIMIT ${limit}
        `;

        return rows.map((row) => ({
            drop: Drop.from({
                id: row.id,
                content: row.content,
                latitude: row.latitude,
                longitude: row.longitude,
                authorId: row.authorId,
                // 잠재적인 BigInt 에러를 막기 위한 명시적 캐스팅 (방어적 프로그래밍)
                likeCount: Number(row.likeCount),
                dislikeCount: Number(row.dislikeCount),
                commentCount: Number(row.commentCount),
                expiresAt: row.expiresAt,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
            }),
            authorNickname: row.authorNickname,
            distance: Number(row.distance),
        }));
    }

    async save(drop: Drop): Promise<Drop> {
        // 도메인 엔티티를 Prisma 영속성 모델에 맞게 매핑하여 Insert
        const savedRow = await this.prisma.drop.create({
            data: {
                id: drop.id,
                content: drop.content,
                latitude: drop.latitude,
                longitude: drop.longitude,
                authorId: drop.authorId,
                likeCount: drop.likeCount,
                dislikeCount: drop.dislikeCount,
                commentCount: drop.commentCount,
                expiresAt: drop.expiresAt,
                createdAt: drop.createdAt,
                // updatedAt은 @updatedAt 에 의해 자동 갱신됨
            },
        });

        // DB에 저장된 결과를 다시 순수 도메인 객체(Drop)으로 복원하여 반환
        return Drop.from({
            id: savedRow.id,
            content: savedRow.content,
            latitude: savedRow.latitude,
            longitude: savedRow.longitude,
            authorId: savedRow.authorId,
            likeCount: savedRow.likeCount,
            dislikeCount: savedRow.dislikeCount,
            commentCount: savedRow.commentCount,
            expiresAt: savedRow.expiresAt,
            createdAt: savedRow.createdAt,
            updatedAt: savedRow.updatedAt,
        });
    }
}