import { ApiProperty } from "@nestjs/swagger";
import { CreateDropResult } from '../../../../application/port/in/dto/create-drop.result';

export class CreateDropResponseDto {
    @ApiProperty({ description: '생성된 드롭의 고유 ID', example: '1' })
    readonly id!: string;

    @ApiProperty({ description: '드롭 생성 시각 (ISO 8601 String)', example: '2026-09-01T08:00:00.000Z' })
    readonly createdAt!: string;

    @ApiProperty({ description: '드롭 소멸 예정 시각 (ISO 8601 String)', example: '2026-09-01T09:00:00.000Z' })
    readonly expiresAt!: string;

    private constructor(id: string, createdAt: string, expiresAt: string) {
        this.id = id;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }

    static from(result: CreateDropResult): CreateDropResponseDto {
        return new CreateDropResponseDto(
            result.id,
            result.createdAt.toISOString(),
            result.expiresAt.toISOString(),
        );
    }
}