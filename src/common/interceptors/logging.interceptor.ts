import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, originalUrl, body } = request;

        // 1. 요청(Request) 로그
        this.logger.log(
            `[Request] ${method} ${originalUrl}\nBody: ${JSON.stringify(this.truncateLongStrings(body), null, 2)}`
        );

        const now = Date.now();

        // 2. 응답(Response) 로그
        return next.handle().pipe(
            tap((data) => {
                const delay = Date.now() - now;
                this.logger.log(
                    `[Response] ${method} ${originalUrl} - ${delay}ms\nData: ${JSON.stringify(this.truncateLongStrings(data), null, 2)}`
                );
            }),
        );
    }

    private truncateLongStrings(data: any): any {
        if (!data || typeof data !== 'object') return data;

        const clone = Array.isArray(data) ? [...data] : { ...data };
        for (const key in clone) {
            if (typeof clone[key] === 'string' && clone[key].length > 100) {
                clone[key] = clone[key].substring(0, 20) + '...[TRUNCATED]';
            } else if (typeof clone[key] === 'object' && clone[key] !== null) {
                clone[key] = this.truncateLongStrings(clone[key]);
            }
        }
        return clone;
    }
}