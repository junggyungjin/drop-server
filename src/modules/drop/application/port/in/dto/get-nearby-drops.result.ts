export class DropAuthorResult {
    private constructor(
        public readonly nickname: string,
    ) { }

    public static from(nickname: string): DropAuthorResult {
        return new DropAuthorResult(nickname);
    }
}

export interface DropInfoResultProps {
    id: string;
    content: string;
    latitude: number;
    longitude: number;
    authorNickname: string;
    likeCount: number;
    dislikeCount: number;
    commentCount: number;
    expiresAt: Date;
    distance: number;
}

export class DropInfoResult {
    private constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly latitude: number,
        public readonly longitude: number,
        public readonly author: DropAuthorResult,
        public readonly likeCount: number,
        public readonly dislikeCount: number,
        public readonly commentCount: number,
        public readonly expiresAt: Date,
        public readonly distance: number,
    ) { }

    public static from(props: DropInfoResultProps): DropInfoResult {
        return new DropInfoResult(
            props.id,
            props.content,
            props.latitude,
            props.longitude,
            DropAuthorResult.from(props.authorNickname),
            props.likeCount,
            props.dislikeCount,
            props.commentCount,
            props.expiresAt,
            props.distance,
        );
    }
}

export class GetNearbyDropsResult {
    private constructor(
        public readonly drops: DropInfoResult[],
    ) { }

    public static from(drops: DropInfoResult[]): GetNearbyDropsResult {
        return new GetNearbyDropsResult(drops);
    }
}