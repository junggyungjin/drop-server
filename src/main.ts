import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. CORS 활성화 (프론트엔드 연동을 위함)
  app.enableCors(); // 이렇게만 하면 전세계의 웹에서 우리 API를 다 찌를 수 있게 됨. 개발할때는 편하지만 배포하기전에 반드시 화이트리스트를 설정해야함

  // 2. 전역 파이프라인 (DTO 유효성 검증 및 반환)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 3. 전역 인터셉터 (성공 시 ApiResponse.OK 포맷 자동 감싸기)
  app.useGlobalInterceptors(new TransformInterceptor());

  // 4. 전역 예외 필터 (실패 시 ApiResponse.ERROR 포맷으로 변환)
  app.useGlobalFilters(new AllExceptionsFilter());

  // 5. Swagger 셋팅
  const config = new DocumentBuilder()
    .setTitle('DROP API')
    .setDescription('위치 기반 익명 소셜 플랫폼 DROP API 명세서')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: '발급받은 JWT Access Token을 입력해 주세요.',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // 엔드포인트를 /api-docs로 설정
  SwaggerModule.setup('api-docs', app, document);


  // 6. 포트 바인딩 및 실행
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger Docs available at: http://localhost:${port}/api-docs`);
}
bootstrap();
