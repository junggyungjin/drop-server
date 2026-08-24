import { DomainException } from "src/common/exceptions/domain.exception";

/**
 * 401 에러용
 * 토큰 자체는 유효해도 그 사이에 유저가 회원 탈퇴를 한 케이스
 * 현재 이 프로젝트의 Axios 인터셉터는 401일 때만 로그아웃 처리(clearToken)를 하도록 설계되어 있음
 */

export class UserNotFoundException extends DomainException {
    constructor() {
        super('존재하지 않거나 탈퇴한 유저입니다.', 'USER_NOT_FOUND');
    }
}