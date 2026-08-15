import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./adapter/in/web/auth.controller";
import { LoginService } from "./application/service/login.service";
import { GoogleOAuthAdapter } from "./adapter/out/google/google-oauth.adapter";
import { JwtTokenAdapter } from "./adapter/out/jwt/jwt-token.adapter";
import { LoginUseCaseSymbol } from "./application/port/in/login.usecase";
import { OAuthPortSymbol } from "./application/port/out/oauth.port";
import { TokenPortSymbol } from "./application/port/out/token.port";
import { JwtStrategy } from "./adapter/in/web/strategies/jwt.strategy";
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        PassportModule,
        // JwtTokenAdapter 내부에서 동적으로 ConfigService를 통해 시크릿을 가져오므로, 빈 깡통으로 등록합니다.
        JwtModule.register({}),
        UserModule
    ],
    controllers: [AuthController],
    providers: [
        // 1. UseCase(In-Port) 기호에 Service(구현체) 매핑
        {
            provide: LoginUseCaseSymbol,
            useClass: LoginService,
        },
        // 2. 외부 통신(Out-Port) 기호에 Google Adapter(구현체) 매핑
        {
            provide: OAuthPortSymbol,
            useClass: GoogleOAuthAdapter,
        },
        // 3. 토큰 발급(Out-Port) 기호에 JWT Adapter(구현체) 매핑
        {
            provide: TokenPortSymbol,
            useClass: JwtTokenAdapter,
        },
        JwtStrategy,
    ],
})
export class AuthModule { }
