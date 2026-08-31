import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GetNearbyDropsUseCase } from "../port/in/get-nearby-drops.usecase";
import { GetNearbyDropsQuery } from "../port/in/dto/get-nearby-drops.query";
import { GetNearbyDropsResult, DropInfoResult } from "../port/in/dto/get-nearby-drops.result";
import type { DropRepositoryPort } from "../port/out/drop.repository.port";
import { DropRepositoryPortSymbol } from "../port/out/drop.repository.port";

@Injectable()
export class GetNearByDropsService implements GetNearbyDropsUseCase {
    private readonly defaultMaxRadius = 200;
    private readonly defaultFetchLimit = 50;

    constructor(
        @Inject(DropRepositoryPortSymbol)
        private readonly dropRepositoryPort: DropRepositoryPort,
        private readonly configService: ConfigService
    ) { }

    async execute(query: GetNearbyDropsQuery): Promise<GetNearbyDropsResult> {
        // 1. Config 또는 상수를 활용한 방어 로직
        const maxRadius = this.configService.get<number>('DROP_MAX_RADIUS', this.defaultMaxRadius);
        const fetchLimit = this.configService.get<number>('DROP_FETCH_LIMIT', this.defaultFetchLimit);

        const safeRaduis = Math.min(query.radius, maxRadius)

        // 2. Out-Port 호출
        const projections = await this.dropRepositoryPort.findNearbyDrops(
            query.latitude,
            query.longitude,
            safeRaduis,
            fetchLimit
        );

        // 3. 도메인 방어 및 매핑 (순수 데이터인 Result DTO로 변환)
        const dropInfoResults = projections
            .filter(projections => !projections.drop.isExpired()) // Double Check: 혹시라도 DB에서 만료된 글이 넘어왔다면 여기서 차단
            .map(projections =>
                DropInfoResult.from({
                    id: projections.drop.id,
                    content: projections.drop.content,
                    latitude: projections.drop.latitude,
                    longitude: projections.drop.longitude,
                    authorNickname: projections.authorNickname,
                    likeCount: projections.drop.likeCount,
                    dislikeCount: projections.drop.dislikeCount,
                    commentCount: projections.drop.commentCount,
                    expiresAt: projections.drop.expiresAt,
                    distance: projections.distance,
                })
            );

        return GetNearbyDropsResult.from(dropInfoResults);
    }

}