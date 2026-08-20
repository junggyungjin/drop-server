import { DomainException } from "src/common/exceptions/domain.exception";

/**
 * 구글이 발급한 토큰이 이상할 때 던지는 예외 (Google OAuth 어댑터 전용)
 */
export class InvalidOAuthTokenException extends DomainException {
    constructor(message: string = '유효하지 않거나 만료된 소셜 토큰입니다.') {
        // 두 번째 파라미터는 프론트엔드가 에러 원인을 식별할 고유 코드
        super(message, 'UNAUTHORIZED_OAUTH_TOKEN');
    }
}