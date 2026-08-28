import type { GetNearbyDropsQuery } from "./dto/get-nearby-drops.query";
import type { GetNearbyDropsResult } from "./dto/get-nearby-drops.result";

export const GetNearbyDropsUseCaseSymbol = Symbol('GetNearbyDropsUseCase');

export interface GetNearbyDropsUseCase {
    execute(query: GetNearbyDropsQuery): Promise<GetNearbyDropsResult>;
}