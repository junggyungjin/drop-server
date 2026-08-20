import { RefreshTokenCommand } from "./dto/refresh-token.command";
import { LoginResult } from "./dto/login.result";

export const RefreshTokenUseCaseSymbol = Symbol('RefreshTokenUseCase');

export interface RefreshTokenUseCase {
    execute(command: RefreshTokenCommand): Promise<LoginResult>;
}