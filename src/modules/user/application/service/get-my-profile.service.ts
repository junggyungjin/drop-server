import { Inject, Injectable } from "@nestjs/common";
import type { GetMyProfileUseCase } from "../port/in/get-my-profile.usecase";
import { GetMyProfileResult } from "../port/in/dto/get-my-profile.result";
import type { UserRepositoryPort } from "../port/out/user.repository.port";
import { UserRepositoryPortSymbol } from "../port/out/user.repository.port";
import { UserProfileNotFoundException } from "../../domain/exceptions/user-profile-not-found.exception";
import { UserBannedException } from "../../domain/exceptions/user-banned.exception";

@Injectable()
export class GetMyProfileService implements GetMyProfileUseCase {
    constructor(
        @Inject(UserRepositoryPortSymbol)
        private readonly userRepositoryPort: UserRepositoryPort,
    ) { }

    async execute(userId: string): Promise<GetMyProfileResult> {
        // 1. UserRepositoryPort를 통해 도메인 엔티티 조회
        const user = await this.userRepositoryPort.findById(userId);

        // 2. 존재 유무 검증
        if (!user) {
            throw new UserProfileNotFoundException();
        }

        // 3. 계정이 정지된 상태라면 내 정보 조회도 차단! (토큰이 살아있어도 막음)
        if (!user.isActive()) {
            throw new UserBannedException(user.id);
        }

        // 4. 도메인 객체를 In-Port의 DTO(Result)로 변환하여 반환
        return GetMyProfileResult.from(user);
    }

}