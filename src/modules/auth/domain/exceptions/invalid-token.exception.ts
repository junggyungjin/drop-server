import { DomainException } from "../../../../common/exceptions/domain.exception";

/**
 * 우리 서버가 발급한 JWT 토큰이 이상할 때 던지는 예외
 */
export class InvalidTokenException extends DomainException {
    constructor() {
        super('유효하지 않거나 만료된 토큰입니다.', 'INVALID_TOKEN');
    }
}