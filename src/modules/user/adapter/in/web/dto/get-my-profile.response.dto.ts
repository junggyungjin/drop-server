import { ApiProperty } from "@nestjs/swagger";
import { GetMyProfileResult } from "src/modules/user/application/port/in/dto/get-my-profile.result";

/**
 * Swagger 전용 DTO
 */

export class GetMyProfileResponseDto {
    @ApiProperty({ description: '유저의 고유 ID', example: 'uuid-1234-...' })
    public readonly id: string;

    @ApiProperty({ description: '가입 경로 (구글, 애플 등)', example: 'google' })
    public readonly provider: string;

    @ApiProperty({ description: '가입 일시' })
    public readonly createdAt: Date;

    private constructor(id: string, provider: string, createdAt: Date) {
        this.id = id;
        this.provider = provider;
        this.createdAt = createdAt;
    }

    // 순수한 Result 객체를 받아 웹용 DTO로 변환
    public static from(result: GetMyProfileResult): GetMyProfileResponseDto {
        return new GetMyProfileResponseDto(result.id, result.provider, result.createdAt);
    }

}