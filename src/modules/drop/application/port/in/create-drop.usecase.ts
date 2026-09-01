import { CreateDropCommand } from "./dto/create-drop.command";
import { CreateDropResult } from "./dto/create-drop.result";

export const CreateDropUseCaseSymbol = Symbol('CreateDropUseCaseSymbol');

export interface CreateDropUseCase {
    execute(command: CreateDropCommand): Promise<CreateDropResult>;
}