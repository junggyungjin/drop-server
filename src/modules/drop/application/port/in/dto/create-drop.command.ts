export class CreateDropCommand {
    private constructor(
        public readonly content: string,
        public readonly latitude: number,
        public readonly longitude: number,
        public readonly ttlHours: number,
        public readonly authorId: string,
    ) { }

    static create(
        content: string,
        latitude: number,
        longitude: number,
        ttlHours: number,
        authorId: string
    ): CreateDropCommand {
        return new CreateDropCommand(content, latitude, longitude, ttlHours, authorId);
    }
}