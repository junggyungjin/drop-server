import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { RefreshTokenUseCase } from '../port/in/refresh-token.usecase';
import { RefreshTokenCommand } from '../port/in/dto/refresh-token.command';
import { LoginResult } from '../port/in/dto/login.result';
import { type TokenPort, TokenPortSymbol } from '../port/out/token.port';
import { type UserRepositoryPort, UserRepositoryPortSymbol } from 'src/modules/user/application/port/out/user.repository.port';
import { UserBannedException } from 'src/modules/user/domain/exceptions/user-banned.exception';
import { UserNotFoundException } from 'src/modules/user/domain/exceptions/user-not-found.exception';

@Injectable()
export class RefreshTokenService implements RefreshTokenUseCase {
    constructor(
        @Inject(TokenPortSymbol) private readonly tokenPort: TokenPort,
        @Inject(UserRepositoryPortSymbol) private readonly userRepositoryPort: UserRepositoryPort,
    ) { }

    public async execute(command: RefreshTokenCommand): Promise<LoginResult> {
        // 1. Refresh Token 해독 및 검증
        const userId = await this.tokenPort.verifyRefreshToken(command.refreshToken);

        // 2. 해당 ID의 유저가 실제로 DB에 존재하는지 확인
        const user = await this.userRepositoryPort.findById(userId);
        if (!user) {
            throw new UserNotFoundException();
        }

        // 3. 계정 정지(Ban) 상태가 아닌지 도메인 룰 검증
        if (!user.isActive()) {
            throw new UserBannedException(user.id);
        }

        // 4. 안전함이 증명되었으니 새로운 Access/Refresh 토큰 동시 발급
        // Promise.all는 병렬로 처리하여 서버의 응답 속도를 최적화한다!
        const [accessToken, refreshToken] = await Promise.all([
            this.tokenPort.generateAccessToken(user.id),
            this.tokenPort.generateRefreshToken(user.id),
        ]);

        // 5. 결과 반환 (단순 갱신이므로 isNewUser는 무조건 false)
        return LoginResult.from(accessToken, refreshToken, false);
    }

}