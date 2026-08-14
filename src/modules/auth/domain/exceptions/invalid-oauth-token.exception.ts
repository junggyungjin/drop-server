import { DomainException } from "src/common/exceptions/domain.exception";

export class InvalidOAuthTokenException extends DomainException {
    constructor(message: string = '유효하지 않거나 만료된 소셜 토큰입니다.') {
        // 두 번째 파라미터는 프론트엔드가 에러 원인을 식별할 고유 코드
        super(message, 'UNAUTHORIZED_OAUTH_TOKEN');
    }
}