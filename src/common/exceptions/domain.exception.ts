export abstract class DomainException extends Error {
    public readonly code: string;
    public readonly details?: Record<string, any>;

    constructor(message: string, code: string, details?: Record<string, any>) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.details = details;

        // V8 엔진에서 Error의 Stack Trace를 캡쳐하여 디버깅을 용이하게함
        Error.captureStackTrace(this, this.constructor);
    }
}