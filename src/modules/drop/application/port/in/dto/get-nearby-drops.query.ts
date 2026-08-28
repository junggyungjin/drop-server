export class GetNearbyDropsQuery {
    private constructor(
        public readonly latitude: number,
        public readonly longitude: number,
        public readonly radius: number, // 검색 반경 (기본값 50)
    ) { }

    public static of(
        latitude: number,
        longitude: number,
        radius: number = 50
    ): GetNearbyDropsQuery {
        // 도메인/애플리케이션 계층에서의 방어 로직 (Invariant Check)
        if (latitude < -90 || latitude > 90) {
            throw new Error('Invalid latitude');
        }
        if (longitude < -180 || longitude > 180) {
            throw new Error('Invalid longitude');
        }
        if (radius <= 0) {
            throw new Error('Radius must be greater than 0');
        }

        return new GetNearbyDropsQuery(latitude, longitude, radius);
    }
}