import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

import { PostsModule } from "./posts/posts.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { HealthController } from "./common/health.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "development" ? ".env.development" : ".env",
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI") || "mongodb://localhost:27017/forito",
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: (configService.get<number>("THROTTLE_TTL") || 60) * 1000,
            limit: configService.get<number>("THROTTLE_LIMIT") || 100,
          },
        ],
      }),
      inject: [ConfigService],
    }),
    PostsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
