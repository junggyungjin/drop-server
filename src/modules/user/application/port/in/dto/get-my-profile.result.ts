import { User } from "src/modules/user/domain/user.entity";

export class GetMyProfileResult {
    private constructor(
        public readonly id: string,
        public readonly provider: string,
        public readonly createdAt: Date,
    ) { }

    public static from(user: User): GetMyProfileResult {
        return new GetMyProfileResult(
            user.id,
            user.provider,
            user.createdAt,
        );
    }
}