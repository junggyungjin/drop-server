import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/api-response.dto';

/**
 * 컨트롤러에서 반환되는 데이터(Response)를 가로채어, 
 * 앞서 만든 ApiResponse.OK() 포맷으로 일괄 변환(Wrapping)해 주는 인터셉터
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((data) => {
                // 이미 컨트롤러에서 명시적으로 ApiResponse 객체를 반환한 경우 중복 래핑을 방지
                if (data instanceof ApiResponse) {
                    return data;
                }

                return ApiResponse.OK(data);
            }),
        );
    }
}