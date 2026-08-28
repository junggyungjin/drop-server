export interface DropProps {
    id: string;
    content: string;
    latitude: number;
    longitude: number;
    authorId: string;
    likeCount: number;
    dislikeCount: number;
    commentCount: number;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export class Drop {
    private constructor(
        private readonly props: DropProps
    ) { }

    get id(): string { return this.props.id; }
    get content(): string { return this.props.content; }
    get latitude(): number { return this.props.latitude; }
    get longitude(): number { return this.props.longitude; }
    get authorId(): string { return this.props.authorId; }
    get likeCount(): number { return this.props.likeCount; }
    get dislikeCount(): number { return this.props.dislikeCount; }
    get commentCount(): number { return this.props.commentCount; }
    get expiresAt(): Date { return this.props.expiresAt; }
    get createdAt(): Date { return this.props.createdAt; }
    get updatedAt(): Date { return this.props.updatedAt; }

    /**
     * 1. 복원 팩토리 메서드 (Rehydration)
     * DB에서 조회한 데이터를 도메인 객체로 인스턴스화 할 때 사용
     */
    public static from(props: DropProps): Drop {
        return new Drop(props);
    }

    /**
     * 2. 생성 팩토리 메서드 (Creation)
     * 새로운 Drop을 생성할 때 사용 (도메인 정책 캡슐화)
     */
    public static create(
        id: string,
        content: string,
        latitude: number,
        longitude: number,
        authorId: string,
        ttlHours: number = 24 // 정책 : 24시간 후 만료
    ): Drop {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + ttlHours * 60 * 60 * 1000);

        return new Drop({
            id,
            content,
            latitude,
            longitude,
            authorId,
            likeCount: 0,       // 초기값 강제
            dislikeCount: 0,
            commentCount: 0,
            expiresAt,
            createdAt: now,
            updatedAt: now,
        });
    }

    /**
     * 3. 도메인 행위 (Behavior) - 상태 변경을 안전하게 처리
     */
    public increaseLike(): void {
        this.props.likeCount += 1;
        this.updateModifiedTime();
    }

    public updateContent(newContent: string): void {
        // Validation 로직 추가 가능
        if (newContent.length === 0) throw new Error('내용은 비어있을 수 없습니다.');
        this.props.content = newContent;
        this.updateModifiedTime();
    }

    private updateModifiedTime(): void {
        this.props.updatedAt = new Date();
    }

    /**
     * 4. 엔티티 동등성 검사 (Identity)
     */
    public equals(other?: Drop): boolean {
        if (other == null) return false;
        if (this === other) return true;
        return this.id === other.id;
    }

    public isExpired(currentTime: Date = new Date()): boolean {
        return currentTime > this.props.expiresAt;
    }
}