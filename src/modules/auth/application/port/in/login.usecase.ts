import type { LoginCommand } from "./dto/login.command";
import type { LoginResult } from "./dto/login.result";

export const LoginUseCaseSymbol = Symbol("LoginUseCase");

export interface LoginUseCase {
    execute(command: LoginCommand): Promise<LoginResult>;
}