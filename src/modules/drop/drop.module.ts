import { Module } from "@nestjs/common";
import { DropController } from "./adapter/in/web/drop.controller";
import { GetNearByDropsService } from "./application/service/get-nearby-drops.service";
import { GetNearbyDropsUseCaseSymbol } from "./application/port/in/get-nearby-drops.usecase";
import { DropRepositoryAdapter } from "./adapter/out/persistence/drop.repository.adapter";
import { DropRepositoryPortSymbol } from "./application/port/out/drop.repository.port";

@Module({
    imports: [],
    controllers: [
        DropController,
    ],
    providers: [
        // 1. Service(UseCase 구현체)등록 및 인터페이스 매핑
        GetNearByDropsService,
        {
            provide: GetNearbyDropsUseCaseSymbol,
            useExisting: GetNearByDropsService,
        },

        // 2. Adapter 등록 및 인터페이스 매핑
        {
            provide: DropRepositoryPortSymbol,
            useClass: DropRepositoryAdapter,
        },
    ],
    exports: [],
})
export class DropModule { }