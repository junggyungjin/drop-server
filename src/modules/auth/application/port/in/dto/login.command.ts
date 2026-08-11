export class LoginCommand {
    public readonly idToken!: string;

    private constructor(idToken: string) {
        this.idToken = idToken;
    }

    public static from(idToken: string): LoginCommand {
        return new LoginCommand(idToken);
    }
}