import { Drop } from "src/modules/drop/domain/drop.entity";

export const SaveDropPortSymbol = Symbol('SaveDropPortSymbol');

export interface SaveDropPort {
    save(drop: Drop): Promise<Drop>;
}