import { Inject, Injectable } from "@nestjs/common";
import { CreateDropUseCase } from "../port/in/create-drop.usecase";
import { CreateDropCommand } from "../port/in/dto/create-drop.command";
import { CreateDropResult } from "../port/in/dto/create-drop.result";
import type { SaveDropPort } from "../port/out/save-drop.port";
import { SaveDropPortSymbol } from "../port/out/save-drop.port";
import { Drop } from "../../domain/drop.entity";

@Injectable()
export class CreateDropService implements CreateDropUseCase {
    constructor(
        @Inject(SaveDropPortSymbol)
        private readonly saveDropPort: SaveDropPort,
    ) { }

    async execute(command: CreateDropCommand): Promise<CreateDropResult> {
        // 1. 도메인 엔티티 생성
        const drop = Drop.create(
            command.content,
            command.latitude,
            command.longitude,
            command.authorId,
            command.ttlHours,
        );

        // 2. DB 저장 위임
        const saveDrop = await this.saveDropPort.save(drop);

        // 3. Result DTO로 매핑하여 리턴
        return CreateDropResult.from(
            saveDrop.id,
            saveDrop.createdAt,
            saveDrop.expiresAt,
        );
    }

}