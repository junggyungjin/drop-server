import { Controller, Get, Post, Body, Query, Inject, HttpCode, HttpStatus, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiOkResponse, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { GetNearbyDropsRequestDto } from './dto/get-nearby-drops.request.dto';
import { DropInfoResponseDto } from './dto/get-nearby-drops.response.dto';
import type { GetNearbyDropsUseCase } from 'src/modules/drop/application/port/in/get-nearby-drops.usecase';
import { GetNearbyDropsUseCaseSymbol } from 'src/modules/drop/application/port/in/get-nearby-drops.usecase';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { CreateDropUseCase } from 'src/modules/drop/application/port/in/create-drop.usecase';
import { CreateDropUseCaseSymbol } from 'src/modules/drop/application/port/in/create-drop.usecase';
import { CreateDropRequestDto } from './dto/create-drop.request.dto';
import { CreateDropResponseDto } from './dto/create-drop.response.dto';
import { CreateDropCommand } from 'src/modules/drop/application/port/in/dto/create-drop.command';

@ApiTags('드롭(Drop)')
@Controller('api/drops')
@ApiExtraModels(ApiResponse, DropInfoResponseDto)
export class DropController {
    constructor(
        @Inject(GetNearbyDropsUseCaseSymbol)
        private readonly getNearbyDropsUseCase: GetNearbyDropsUseCase,
        @Inject(CreateDropUseCaseSymbol)
        private readonly createDropUseCase: CreateDropUseCase,
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

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: '새로운 드롭 생성',
        description: '현재 위치 반경에 새로운 휘발성 드롭(게시글)을 생성합니다.'
    })
    @ApiBody({ type: CreateDropRequestDto })
    @ApiCreatedResponse({
        description: '드롭이 성공적으로 생성되었습니다.',
        type: CreateDropResponseDto
    })
    @ApiBadRequestResponse({ description: '유효하지 않은 입력값입니다. (예: content 300자 초과)' })
    @ApiUnauthorizedResponse({ description: '유효하지 않은 토큰이거나 인증되지 않은 사용자입니다.' })
    async createDrop(
        @Body() request: CreateDropRequestDto,
        @CurrentUser() user: { id: string }
    ) {
        // 1. Controller에서 Command 객체 조립
        const command = CreateDropCommand.create(
            request.content,
            request.latitude,
            request.longitude,
            request.ttlHours,
            user.id
        )

        // 2. 비즈니스 로직 호출
        const result = await this.createDropUseCase.execute(command);

        // 3. 순수 Result를 Web 전용 Response DTO로 매핑
        const responseDto = CreateDropResponseDto.from(result);

        // 4. 리턴
        return ApiResponse.OK(responseDto);
    }
}