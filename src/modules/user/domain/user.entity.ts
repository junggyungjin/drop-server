export type UserStatus = 'ACTIVE' | 'BANNED' | 'WITHDRAWN';

export class User {
    private constructor(
        public readonly id: string,
        public readonly provider: string,
        public readonly providerId: string,
        public readonly status: UserStatus,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }

    // 신규 구글 소설 유지 생성
    public static createGoogleUser(id: string, providerId: string): User {
        const now = new Date();
        return new User(id, 'google', providerId, 'ACTIVE', now, now);
    }

    // DB에서 가져온 데이터를 도메인 객체로 복원 (Restore)
    public static from(
        id: string,
        provider: string,
        providerId: string,
        status: UserStatus,
        createdAt: Date,
        updatedAt: Date,
    ): User {
        return new User(id, provider, providerId, status, createdAt, updatedAt);
    }

    // 유저 정지 로직
    public ban(): User {
        if (this.status === 'BANNED') {
            throw new Error('이미 정지된 유저입니다.');
        }
        return new User(
            this.id,
            this.provider,
            this.providerId,
            'BANNED',
            this.createdAt,
            new Date(),
        );
    }

    // 활성 상태 확인
    public isActive(): boolean {
        return this.status === 'ACTIVE';
    }
}