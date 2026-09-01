import { Module } from "@nestjs/common";
import { DropController } from "./adapter/in/web/drop.controller";
import { GetNearByDropsService } from "./application/service/get-nearby-drops.service";
import { GetNearbyDropsUseCaseSymbol } from "./application/port/in/get-nearby-drops.usecase";
import { DropRepositoryAdapter } from "./adapter/out/persistence/drop.repository.adapter";
import { DropRepositoryPortSymbol } from "./application/port/out/drop.repository.port";
import { CreateDropService } from "./application/service/create-drop.service";
import { CreateDropUseCaseSymbol } from "./application/port/in/create-drop.usecase";
import { SaveDropPortSymbol } from "./application/port/out/save-drop.port";

@Module({
    imports: [],
    controllers: [
        DropController,
    ],
    providers: [
        // 1. Service(UseCase 구현체)등록 및 인터페이스 매핑
        GetNearByDropsService,
        CreateDropService,
        {
            provide: GetNearbyDropsUseCaseSymbol,
            useExisting: GetNearByDropsService,
        },
        {
            provide: CreateDropUseCaseSymbol,
            useExisting: CreateDropService,
        },

        // 2. Adapter 등록 및 인터페이스 매핑
        DropRepositoryAdapter,
        {
            provide: DropRepositoryPortSymbol,
            useExisting: DropRepositoryAdapter,
        },
        {
            provide: SaveDropPortSymbol,
            useExisting: DropRepositoryAdapter,
        },
    ],
    exports: [],
})
export class DropModule { }