import { DomainException } from "src/common/exceptions/domain.exception";

export class UserBannedException extends DomainException {
    constructor(userId: string) {
        super(
            '접근이 차단된 계정입니다.',
            'USER_BANNED', // 프론트엔드가 에러 원인을 식별할 코드 
            { userId } // 디버깅을 위한 추가 정보
        );
    }
}