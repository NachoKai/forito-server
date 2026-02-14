import { Controller, Get } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";

@Controller("health")
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  check() {
    const mongoStatus = this.connection.readyState === 1 ? "up" : "down";

    return {
      status: mongoStatus === "up" ? "ok" : "error",
      timestamp: new Date().toISOString(),
      services: {
        database: mongoStatus,
      },
    };
  }
}
