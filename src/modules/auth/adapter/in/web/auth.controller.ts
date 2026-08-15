import { Controller, Post, Body, Inject, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from "@nestjs/swagger";
import { type LoginUseCase, LoginUseCaseSymbol } from "src/modules/auth/application/port/in/login.usecase";
import { LoginRequestDto } from "./dto/login.request.dto";
import { ApiResponse } from "src/common/dto/api-response.dto";
import { LoginResult } from "src/modules/auth/application/port/in/dto/login.result";

@ApiTags('인증(Auth)')
@Controller('api/auth')
export class AuthController {
    constructor(
        // 구현체가 아닌 '인터페이스(Port)' 심볼을 주입받아 결합도를 낮춘다
        @Inject(LoginUseCaseSymbol)
        private readonly loginUseCase: LoginUseCase,
    ) { }

    @Post('google/login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '구글 소셜 로그인', description: '구글 ID 토큰을 검증하고 서비스 익명 접근용 JWT를 발급합니다.' })
    @SwaggerResponse({ status: 200, description: '로그인 성공 (Access/Refresh Token 반환)' })
    async loginWithGoogle(@Body() dto: LoginRequestDto): Promise<ApiResponse<LoginResult>> {
        // 1. Web 계층의 DTO를 비즈니스 계층의 Command로 변환
        const command = dto.toCommand();

        // 2. UseCase(Service) 실행
        const result = await this.loginUseCase.execute(command);

        // 3. 프로젝트 룰에 따라 명시적으로 ApiResponse.OK 로 감싸서 반환
        return ApiResponse.OK(result); // return result; 로 해도 인터셉트가 알아서 포장을 해주긴 함
    }
}