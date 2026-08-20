import { DomainException } from "src/common/exceptions/domain.exception";

export class UserNotFoundException extends DomainException {
    constructor() {
        super('존재하지 않거나 탈퇴한 유저입니다.', 'USER_NOT_FOUND');
    }
}