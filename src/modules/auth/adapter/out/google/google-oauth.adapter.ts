import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OAuth2Client } from "google-auth-library";
import { OAuthPort } from "src/modules/auth/application/port/out/oauth.port";
import { InvalidOAuthTokenException } from "src/modules/auth/domain/exceptions/invalid-oauth-token.exception";

@Injectable()
export class GoogleOAuthAdapter implements OAuthPort {
    private readonly client: OAuth2Client;
    private readonly clientId: string;

    constructor(private readonly configService: ConfigService) {
        const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');

        // 환경변수가 없으면 서버 부팅 시점에 즉시 에러 발생
        if (!clientId) {
            throw new Error('환경변수 누락 : GOOGLE_CLIENT_ID 설정되지 않았습니다.');
        }

        this.clientId = clientId;
        this.client = new OAuth2Client(this.clientId);
    }

    async verifyIdToken(idToken: string): Promise<string> {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken,
                audience: this.clientId,
            });

            const payload = ticket.getPayload();

            if (!payload || !payload.sub) {
                throw new InvalidOAuthTokenException('구글 토큰에서 유저 식별자(sub)를 찾을 수 없습니다.');
            }

            return payload.sub;
        } catch (error) {
            if (error instanceof InvalidOAuthTokenException) throw error;

            throw new InvalidOAuthTokenException('유효하지 않거나 조작된 구글 토큰입니다.');
        }
    }
}