import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsLatitude, IsLongitude, IsOptional, Max, Min } from "class-validator";
import { GetNearbyDropsQuery } from "src/modules/drop/application/port/in/dto/get-nearby-drops.query";

export class GetNearbyDropsRequestDto {
    @ApiProperty({ description: '현재 위도', example: 37.5666102 })
    @Type(() => Number)
    @IsLatitude()
    readonly latitude!: number;

    @ApiProperty({ description: '현재 경도', example: 126.9783881 })
    @Type(() => Number)
    @IsLongitude()
    readonly longitude!: number;

    @ApiPropertyOptional({ description: '검색 반경 (m) - 미입력 시 50m', default: 50, maximum: 200 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(200)
    readonly radius?: number;

    // Web 계층의 DTO를 Application 계층의 Query로 변환하는 책임
    public toQuery(): GetNearbyDropsQuery {
        return GetNearbyDropsQuery.of(this.latitude, this.longitude, this.radius);
    }
}