import { Injectable } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';

/**
 * 선택적 JWT 인증 가이드
 * 비로그인 유저도 맵에 떠있는 드랍은 볼 수 있어야함 (메세지는 못봄)
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    // Passport의 기본 handleRequest 로직을 오버라이딩하여 에러를 던지지 않도록 수정
    handleRequest(err: any, user: any, info: any) {
        // 토큰이 아예 없거나, 토큰이 만료되었거나, 손상된 경우에도(err 또는 info 존재)
        // 401 에러를 던지지 않고 무조건 user(성공 시) 또는 null(실패 시)을 반환
        return user || null;
    }
}