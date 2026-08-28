import { Controller, Get, Query, Inject, HttpCode, HttpStatus, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { GetNearbyDropsRequestDto } from './dto/get-nearby-drops.request.dto';
import { DropInfoResponseDto } from './dto/get-nearby-drops.response.dto';
import type { GetNearbyDropsUseCase } from 'src/modules/drop/application/port/in/get-nearby-drops.usecase';
import { GetNearbyDropsUseCaseSymbol } from 'src/modules/drop/application/port/in/get-nearby-drops.usecase';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('드롭(Drop)')
@Controller('api/drops')
@ApiExtraModels(ApiResponse, DropInfoResponseDto)
export class DropController {
    constructor(
        @Inject(GetNearbyDropsUseCaseSymbol)
        private readonly getNearbyDropsUseCase: GetNearbyDropsUseCase,
    ) { }

    @Get('nearby')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '주변 DROP 조회', description: '내 위치를 기준으로 반경 내의 DROP 목록을 거리순으로 조회' })
    @ApiOkResponse({
        description: '만료되지 않느 주변 Drop 목록 반환',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: getSchemaPath(DropInfoResponseDto) },
                        },
                    },
                },
            ],
        },
    })
    async getNearbyDrops(
        @Query() requestDto: GetNearbyDropsRequestDto,
    ): Promise<ApiResponse<DropInfoResponseDto[]>> {

        // 1. DTO -> Query 변환
        const query = requestDto.toQuery();

        // 2. UseCase 실행
        const result = await this.getNearbyDropsUseCase.execute(query);

        // 3. Result -> Response DTO 매핑
        const responseData = result.drops.map(drop => DropInfoResponseDto.from(drop))

        // 4. 공통 응답 래퍼로 감싸서 반환
        return ApiResponse.OK(responseData);
    }
}