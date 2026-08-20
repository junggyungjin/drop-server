export const TokenPortSymbol = Symbol('TokenPort');

export interface TokenPort {
    generateAccessToken(userId: string): Promise<string>;
    generateRefreshToken(userId: string): Promise<string>;
    verifyRefreshToken(token: string): Promise<string>;
}