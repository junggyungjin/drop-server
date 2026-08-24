import type { GetMyProfileResult } from "./dto/get-my-profile.result";

export const GetMyProfileUseCaseSymbol = Symbol('GetMyProfileUseCase');

export interface GetMyProfileUseCase {
    execute(userId: string): Promise<GetMyProfileResult>;
}