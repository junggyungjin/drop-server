import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsLatitude,
    IsLongitude,
    IsInt,
    IsIn,
} from 'class-validator';

export class CreateDropRequestDto {
    @ApiProperty({ description: '드롭 내용(최대 300자)', example: '불꽃 놀이 시작했다~!' })
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty({ message: '내용을 입력해주세요.' })
    @MaxLength(300)
    readonly content!: string;

    @ApiProperty({ description: '위도 (Latitude)', example: 37.5665 })
    @Type(() => Number)
    @IsLatitude()
    @IsNotEmpty()
    readonly latitude!: number;

    @ApiProperty({ description: '경도 (Longitude)', example: 126.9780 })
    @Type(() => Number)
    @IsLongitude()
    @IsNotEmpty()
    readonly longitude!: number;

    @ApiProperty({ description: '폭파 타이머 (시간 단위: 1, 12, 24 중 택일)', example: 1 })
    @IsInt()
    @IsNotEmpty()
    @IsIn([1, 12, 24], { message: 'TTL은 1, 12, 24 시간 중 하나여야 합니다.' })
    readonly ttlHours!: number;
}