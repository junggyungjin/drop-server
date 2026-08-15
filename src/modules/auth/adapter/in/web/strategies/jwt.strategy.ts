import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { CurrentUserPayload } from "src/common/decorators/current-user.decorator";

export type JwtPayload = {
    id: string;
    iat: number; // 발급 시간
    exp: number; // 만료 시간
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly configService: ConfigService) {
        const secret = configService.get<string>('JWT_ACCESS_SECRET');
        if (!secret) {
            throw new Error('환경변수 누락: JWT_ACCESS_SECRET이 설정되지 않았습니다.');
        }
        super({
            // 1. 헤더에서 Bearer 토큰 추출
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // 2. 만료된 토큰은 얄짤없이 컷
            ignoreExpiration: false,
            // 3. 토큰을 뜯어볼 비밀키 제공
            secretOrKey: secret,
        });
    }

    async validate(payload: JwtPayload): Promise<CurrentUserPayload> {
        return { id: payload.id };
    }
}