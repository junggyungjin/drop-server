export const OAuthPortSymbol = Symbol('OAuthPort');

export interface OAuthPort {
    /** 구글 ID 토큰을 검증하고, 고유 식별자(providerId)를 반환합니다. */
    verifyIdToken(idToken: string): Promise<string>;
}