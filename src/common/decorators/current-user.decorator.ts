import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * JWT 검증 가드(Guard)를 통과한 후, 
 * 요청(Request) 객체에 담긴 유저 정보를 컨트롤러에서 손쉽게 추출하기 위한 파라미터 데코레이터
 */

// 완전 익명성에 맞추어 Payload에는 식별자(UUID)만 포함
export interface CurrentUserPayload {
    id: string;
}

// 현재 로그인한 유저 정보를 Request에서 깔끔하게 추출하는 커스텀 데코레이터
export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): CurrentUserPayload | null => {
        const request = ctx.switchToHttp().getRequest();

        // AuthGuard를 통과하며 Request 객체에 주입된 user 정보를 반환
        // (이후 작성할 Optional Guard에 의해 비로그인 유저인 경우 null을 반환)
        return request.user || null;
    },
);