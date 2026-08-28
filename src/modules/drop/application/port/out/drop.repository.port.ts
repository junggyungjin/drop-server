import type { Drop } from "src/modules/drop/domain/drop.entity";

/**
 * DB(Adapter)에서 PostGIS 쿼리와 JOIN을 통해 가져온 
 * 순수 도메인 엔티티와 동적 프로젝션 데이터를 함께 담는 객체
 */
export interface NearbyDropProjection {
    readonly drop: Drop;
    readonly authorNickname: string;
    readonly distance: number;
}

// 의존성 주입(DI)을 위한 고유 심볼 (프로젝트 룰 준수)
export const DropRepositoryPortSymbol = Symbol('DropRepositoryPortSymbol');

export interface DropRepositoryPort {
    /**
     * 특정 좌표(위/경도)를 기준으로 반경(radius) 이내의 Drop 목록을 
     * 가까운 거리 순으로 정렬하여 반환합니다.
     * 
     * @param latitude 중심 위도
     * @param longitude 중심 경도
     * @param radius 검색 반경 (미터)
     * @param limit // . 공간 쿼리(ST_DWithin)는 비용이 꽤 비싼 연산이므로, DB 부하를 막기 위해 최대 반환 개수(limit)를 Port 단계에서 강제하거나 넘겨주는 것이 안전
     */
    findNearbyDrops(
        latitude: number,
        longitude: number,
        radius: number,
        limit?: number
    ): Promise<NearbyDropProjection[]>;
}