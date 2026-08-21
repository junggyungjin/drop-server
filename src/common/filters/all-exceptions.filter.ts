import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { ApiError, ApiResponse } from '../dto/api-response.dto';
import { DomainException } from '../exceptions/domain.exception';

/**
 * 전역 예외 처리 필터
 * 앱 내에서 발생하는 모든 에러를 낚아채어 로깅
 * 프론트엔드에게 방금 만든 ApiResponse.ERROR(...) 규격의 안전한 JSON 형식으로 변환해 주는 필수 필터
 */

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let code = 'INTERNAL_SERVER_ERROR';
        let message = '서버 내부 오류가 발생했습니다.';
        let details: any = undefined;

        if (exception instanceof DomainException) {
            // 1. 우리가 정의한 도메인 비즈니스 예외 처리
            if (
                exception.code === 'INVALID_TOKEN' ||
                exception.code === 'USER_NOT_FOUND' ||
                exception.code === 'UNAUTHORIZED_OAUTH_TOKEN'
            ) {
                status = HttpStatus.UNAUTHORIZED; // 401
            } else if (exception.code === 'USER_BANNED') {
                status = HttpStatus.FORBIDDEN; // 403
            } else {
                status = HttpStatus.BAD_REQUEST; // 400
            }

            code = exception.code;
            message = exception.message;
            details = exception.details;
        } else if (exception instanceof HttpException) {
            // 2. NestJS 내장 HTTP 예외 및 ValidationPipe 에러 처리
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse() as any;

            // class-validator가 던지는 배열 형태의 에러 메시지 파싱
            if (typeof exceptionResponse === 'object' && exceptionResponse.message) {
                code = exceptionResponse.error?.replace(/\s+/g, '_').toUpperCase() || 'BAD_REQUEST';
                message = Array.isArray(exceptionResponse.message)
                    ? exceptionResponse.message[0] // 대표 메시지 1개만 노출
                    : exceptionResponse.message;
                details = Array.isArray(exceptionResponse.message)
                    ? exceptionResponse.message // 전체 에러 내역은 details에 보관
                    : undefined;
            } else {
                code = 'HTTP_EXCEPTION';
                message = exception.message;
            }
        } else if (exception instanceof Error) {
            // 개발용 코드 실제 배포 때는 500번대 시스템 에러 메시지가 클라이언트로 넘어가서 유저들에게 보여질 위험이 있음
            // 런타임 에러(DB 연결 끊김, ne 등등)
            message = exception.message;
        }

        // 서버 콘솔/로그 파일에 여러 추적 스택 기록
        this.logger.error(
            `[${request.method}] ${request.url} - ${status} - ${code} - ${message}`,
            exception instanceof Error ? exception.stack : '',
        );

        // 프론트엔드에게는 항상 통일된 ApiResponse 포맷으로 응답
        const apiError = new ApiError(code, message, details);
        const errorResponse = ApiResponse.ERROR(apiError);

        response.status(status).json(errorResponse);
    }
}