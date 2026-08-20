import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { TokenPort } from '../../../application/port/out/token.port'
import { InvalidTokenException } from "src/modules/auth/domain/exceptions/invalid-token.exception";
import { SignOptions } from 'jsonwebtoken'

@Injectable()
export class JwtTokenAdapter implements TokenPort {
    private readonly accessSecret: string;
    private readonly accessExpiresIn: string;
    private readonly refreshSecret: string;
    private readonly refreshExpiresIn: string;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {
        const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
        const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

        if (!accessSecret || !refreshSecret) {
            throw new Error('환경변수 누락: JWT SECRET(Access 또는 Refresh)이 설정되지 않았습니다.');
        }

        this.accessSecret = accessSecret;
        this.refreshSecret = refreshSecret;
        this.accessExpiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '1h';
        this.refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '14d';
    }

    async generateAccessToken(userId: string): Promise<string> {
        const payload = { id: userId };
        return this.jwtService.signAsync(payload, {
            secret: this.accessSecret,
            expiresIn: this.accessExpiresIn as SignOptions['expiresIn']
        });
    }

    async generateRefreshToken(userId: string): Promise<string> {
        const payload = { id: userId };
        return this.jwtService.signAsync(payload, {
            secret: this.refreshSecret,
            expiresIn: this.refreshExpiresIn as SignOptions['expiresIn']
        });
    }

    async verifyRefreshToken(token: string): Promise<string> {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.refreshSecret,
            });
            // 검증 성공 시 토큰 안에 들어있던 userId 리턴
            return payload.id;
        } catch (error) {
            // 만료되었거나 변조된 토큰일 경우 에러 발생
            throw new InvalidTokenException();
        }
    }
}