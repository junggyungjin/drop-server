import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { RefreshTokenCommand } from "src/modules/auth/application/port/in/dto/refresh-token.command";

export class RefreshTokenRequestDto {
    @ApiProperty({
        description: '만료된 Access Token을 갱신하기 위해 사용할 Refresh Token',
        example: 'eyJhbGciOiJIUzI1NiIsInR... (생략)',
    })
    @IsString({ message: 'refreshToken은 문자열 포맷이어야 합니다.' })
    @IsNotEmpty({ message: 'refreshToken은 필수 입력 값입니다.' })
    public readonly refreshToken!: string;

    // 외부 계층의 DTO를 내부 비즈니스 로직의 Command로 변환
    public toCommand(): RefreshTokenCommand {
        return RefreshTokenCommand.from(this.refreshToken);
    }
}