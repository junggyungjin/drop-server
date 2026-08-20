import { BadRequestException } from "@nestjs/common";

export class RefreshTokenCommand {
    private constructor(public readonly refreshToken: string) { }

    public static from(refreshToken: string): RefreshTokenCommand {
        if (!refreshToken || refreshToken.trim() === '') {
            throw new BadRequestException('Refresh Token이 제공되지 않았습니다.');
        }

        return new RefreshTokenCommand(refreshToken);
    }
}