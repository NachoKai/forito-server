import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import compression from "compression";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { SuccessInterceptor } from "./common/interceptors/success.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT") || 5000;
  const isProduction = configService.get<string>("NODE_ENV") === "production";

  if (!isProduction) {
    app.use(helmet());
    app.use(compression());
  }

  const corsOrigin = configService.get<string>("CORS_ORIGIN");
  app.enableCors({
    origin: corsOrigin || true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new SuccessInterceptor());

  if (!isProduction) {
    app.useGlobalInterceptors(new LoggingInterceptor());
  }

  app.setGlobalPrefix("api");

  await app.listen(port);
  console.log(`Forito listening on port ${port}`);
}

bootstrap();
