import { DomainException } from "src/common/exceptions/domain.exception";

/**
 * 404 에러용
 */

export class UserProfileNotFoundException extends DomainException {
    constructor() {
        super('요청하신 유저 정보를 찾을 수 없습니다.', 'USER_PROFILE_NOT_FOUND');
    }
}