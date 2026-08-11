export class LoginResult {
    public readonly accessToken!: string;
    public readonly refreshToken!: string;
    public readonly isNewUser!: boolean;

    private constructor(accessToken: string, refreshToken: string, isNewUser: boolean) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.isNewUser = isNewUser;
    }

    public static from(accessToken: string, refreshToken: string, isNewUser: boolean): LoginResult {
        return new LoginResult(accessToken, refreshToken, isNewUser);
    }

}