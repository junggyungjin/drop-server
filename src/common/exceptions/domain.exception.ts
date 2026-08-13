/**
 * 비즈니스 로직(Service, Entity 등)에서 발생하는 에러를 명확하게 식별하고, 
 * HTTP 상태 코드가 아닌 비즈니스 에러 코드로 관리하기 위한 커스텀 예외 클래스
 */
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