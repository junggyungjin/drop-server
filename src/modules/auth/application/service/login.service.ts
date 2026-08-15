import { Inject, Injectable } from '@nestjs/common'
import { UserBannedException } from 'src/modules/user/domain/exceptions/user-banned.exception'
import { randomUUID } from 'crypto'
import type { LoginUseCase } from '../port/in/login.usecase'
import { LoginCommand } from '../port/in/dto/login.command'
import { LoginResult } from '../port/in/dto/login.result'
import { type OAuthPort, OAuthPortSymbol } from '../port/out/oauth.port'
import { type TokenPort, TokenPortSymbol } from '../port/out/token.port'
import { type UserRepositoryPort, UserRepositoryPortSymbol } from 'src/modules/user/application/port/out/user.repository.port'
import { User } from 'src/modules/user/domain/user.entity'
import { use } from 'passport'

@Injectable()
export class LoginService implements LoginUseCase {
    constructor(
        @Inject(OAuthPortSymbol) private readonly oauthPort: OAuthPort,
        @Inject(UserRepositoryPortSymbol) private readonly userRepositoryPort: UserRepositoryPort,
        @Inject(TokenPortSymbol) private readonly tokenPort: TokenPort
    ) { }

    public async execute(command: LoginCommand): Promise<LoginResult> {
        // 1. 구글 토큰 검증
        const providerId = await this.oauthPort.verifyIdToken(command.idToken);

        // 2. 유저 조회
        let user = await this.userRepositoryPort.findByProviderId('google', providerId);
        let isNewUser = false;

        // 3. 신규 가입 처리 (User 도메인의 팩토리 로직 활용)
        if (!user) {
            isNewUser = true;
            const newUser = User.createGoogleUser(randomUUID(), providerId);
            user = await this.userRepositoryPort.save(newUser);
        }

        // 4. 활성 상태 확인 (User 도메인의 비즈니스 로직 활용)
        if (!user.isActive()) {
            throw new UserBannedException(user.id);
        }

        // 5. JWT Access/Refresh 토큰 동시 발급
        const [accessToken, refreshToken] = await Promise.all([
            this.tokenPort.generateAccessToken(user.id),
            this.tokenPort.generateRefreshToken(user.id),
        ]);

        // 6. 불변성 객체로 감싸서 반환
        return LoginResult.from(accessToken, refreshToken, isNewUser);
    }
}