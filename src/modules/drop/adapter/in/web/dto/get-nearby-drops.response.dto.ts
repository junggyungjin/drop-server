import { ApiProperty } from "@nestjs/swagger";
import { DropInfoResult } from "src/modules/drop/application/port/in/dto/get-nearby-drops.result";

export class DropAuthorResponseDto {
    @ApiProperty({ description: '작성자 닉네임', example: '익명' })
    public readonly nickname: string;

    constructor(nickname: string) {
        this.nickname = nickname;
    }
}

export class DropInfoResponseDto {
    @ApiProperty({ description: 'DROP 고유 ID' })
    public readonly id!: string;

    @ApiProperty({ description: '본문 내용' })
    public readonly content: string;

    @ApiProperty({ description: '위도', example: 37.5667902 })
    public readonly latitude: number;

    @ApiProperty({ description: '경도', example: 126.9783881 })
    public readonly longitude: number;

    @ApiProperty({ description: '작성자 정보', type: DropAuthorResponseDto })
    public readonly author: DropAuthorResponseDto;

    @ApiProperty({ description: '좋아요 수', example: 12 })
    public readonly likeCount: number;

    @ApiProperty({ description: '댓글 수', example: 3 })
    public readonly commentCount: number;

    @ApiProperty({ description: '만료 일시 (ISO 8601)', example: '2026-08-28T04:17:26.000Z' })
    public readonly expiresAt: string;

    @ApiProperty({ description: '나와의 거리 (m)', example: 42 })
    public readonly distance: number;

    private constructor(
        id: string, content: string, latitude: number, longitude: number,
        author: DropAuthorResponseDto, likeCount: number, commentCount: number,
        expiresAt: string, distance: number
    ) {
        this.id = id;
        this.content = content;
        this.latitude = latitude;
        this.longitude = longitude;
        this.author = author;
        this.likeCount = likeCount;
        this.commentCount = commentCount;
        this.expiresAt = expiresAt;
        this.distance = distance;
    }

    // 순수한 Result 객체를 받아 웹용 DTO 인스턴스로 변환
    public static from(result: DropInfoResult): DropInfoResponseDto {
        return new DropInfoResponseDto(
            result.id,
            result.content,
            result.latitude,
            result.longitude,
            new DropAuthorResponseDto(result.author.nickname), // 중첩 객체 변환
            result.likeCount,
            result.commentCount,
            result.expiresAt.toISOString(),
            Math.round(result.distance),
        );
    }
}