import { Module } from "@nestjs/common";
import { UserRepositoryPortSymbol } from "./application/port/out/user.repository.port";
import { UserRepositoryAdapter } from "./adapter/out/persistence/user.repository.adapter";
import { UserController } from "./adapter/in/web/user.controller";
import { GetMyProfileService } from "./application/service/get-my-profile.service";
import { GetMyProfileUseCaseSymbol } from "./application/port/in/get-my-profile.usecase";

@Module({
    controllers: [
        UserController,
    ],
    providers: [
        // 1. Service 구현체를 실제 클래스로 직접 등록 (NestJS 싱글톤)
        GetMyProfileService,
        {
            provide: GetMyProfileUseCaseSymbol,
            useExisting: GetMyProfileService,
        },
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