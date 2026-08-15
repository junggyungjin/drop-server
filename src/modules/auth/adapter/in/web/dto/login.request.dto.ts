import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { LoginCommand } from "src/modules/auth/application/port/in/dto/login.command";

export class LoginRequestDto {
    @ApiProperty({
        description: '구글 로그인 성공 후 클라이언트가 발급받은 ID Token',
        example: 'eyJhbGciOiJSUzI1NiIsImtpZ... (생략)',
    })
    @IsString({ message: 'idToken은 문자열 포맷이어야 합니다.' })
    @IsNotEmpty({ message: 'idToken은 필수 입력 값입니다.' })
    public readonly idToken!: string;

    // 외부(Web) 계층의 DTO를 내부 비즈니스(UseCase) 계층의 Command로 변환하는 팩토리 메서드
    // Controller가 비즈니스 로직에 종속되는 것을 방지합니다.
    public toCommand(): LoginCommand {
        return LoginCommand.from(this.idToken);
    }
}