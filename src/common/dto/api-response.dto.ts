import { ApiProperty } from "@nestjs/swagger";

export class ApiError {
    @ApiProperty({ description: '비즈니스 에러 코드', example: 'INVALID_REQUEST' })
    public readonly code: string;

    @ApiProperty({ description: '에러 상세 메시지', example: '잘못된 요청입니다.' })
    public readonly message: string;

    @ApiProperty({ description: '유효성 검사 실패 등 상세 내역', required: false })
    public readonly details?: Record<string, any> | any[];

    constructor(code: string, message: string, details?: Record<string, any> | any[]) {
        this.code = code;
        this.message = message;
        this.details = details;
    }
}

export class ApiResponse<T> {
    @ApiProperty({ description: 'API 성공 여부', example: true })
    public readonly success: boolean;

    @ApiProperty({ description: '응답 생성 시각', example: '2026-08-12T12:00:00.000Z' })
    public readonly timestamp: string;

    @ApiProperty({ description: '성공 시 반환되는 응답 데이터', required: false })
    public readonly data?: T;

    @ApiProperty({ description: '실패 시 반환되는 에러 정보', type: () => ApiError, required: false })
    public readonly error?: ApiError;

    private constructor(success: boolean, data?: T, error?: ApiError
    ) {
        this.success = success;
        this.timestamp = new Date().toISOString();
        this.data = data;
        this.error = error;
    }

    public static OK<T>(data: T): ApiResponse<T> {
        return new ApiResponse<T>(true, data);
    }

    public static ERROR(error: ApiError): ApiResponse<any> {
        return new ApiResponse<any>(false, undefined, error);
    }
}