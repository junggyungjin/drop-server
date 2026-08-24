import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiResponse as SwaggerApiResponse, ApiTags } from "@nestjs/swagger";
import { GetMyProfileUseCaseSymbol } from "src/modules/user/application/port/in/get-my-profile.usecase";
import type { GetMyProfileUseCase } from "src/modules/user/application/port/in/get-my-profile.usecase";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import type { CurrentUserPayload } from "src/common/decorators/current-user.decorator";
import { ApiResponse } from "src/common/dto/api-response.dto";
import { GetMyProfileResult } from "src/modules/user/application/port/in/dto/get-my-profile.result";
import { GetMyProfileResponseDto } from "./dto/get-my-profile.response.dto";

@ApiTags('Users')
@Controller('api/users')
export class UserController {
    constructor(
        @Inject(GetMyProfileUseCaseSymbol)
        private readonly getMyProfileUseCase: GetMyProfileUseCase,
    ) { }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: '내 정보 조회 ' })
    @SwaggerApiResponse({
        status: 200,
        description: '조회 성공',
        //순수 Result 대신 Swagger 데코레이터가 있는 Web DTO를 지정합니다!
        type: GetMyProfileResponseDto
    })
    async getMyProfile(
        @CurrentUser() userPayload: CurrentUserPayload,
    ): Promise<ApiResponse<GetMyProfileResponseDto>> {
        // 1. CurrentUser 커스텀 데코레이터를 통해 추출한 payload에서 userId(id)를 꺼내고
        // 2. In-Port(UseCase)에 도메인 로직 처리를 위임
        const result = await this.getMyProfileUseCase.execute(userPayload.id);

        // 3. Result를 Web DTO로 한번 포장해서 리턴
        const responseDto = GetMyProfileResponseDto.from(result);

        // 4. 반환받ㅇ느 Result 객체를 프로젝트 공통 포맷인 ApiResponse로 감싸서 리턴
        return ApiResponse.OK(responseDto);
    }
}