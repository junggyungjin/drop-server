export class CreateDropResult {
    private constructor(
        public readonly id: string,
        public readonly createdAt: Date,
        public readonly expiresAt: Date,
    ) { }

    static from(id: string, createdAt: Date, expiresAt: Date): CreateDropResult {
        return new CreateDropResult(id, createdAt, expiresAt);
    }
}