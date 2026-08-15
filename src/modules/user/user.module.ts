import { Module } from "@nestjs/common";
import { UserRepositoryPortSymbol } from "./application/port/out/user.repository.port";
import { UserRepositoryAdapter } from "./adapter/out/persistence/user.repository.adapter";

@Module({
    providers: [
        {
            provide: UserRepositoryPortSymbol,
            useClass: UserRepositoryAdapter,
        },
    ],
    exports: [
        // 외부 모듈(AuthModule의 LoginService)에서 이 포트를 주입받기 위해 
        // 반드시 외부로 노출(Export)해 주어야 합니다.
        UserRepositoryPortSymbol,
    ],
})
export class UserModule { }