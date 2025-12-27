import { IsNotEmpty, IsObject } from "class-validator";

export class AddNotificationDto {
  @IsObject()
  @IsNotEmpty()
  notification: any;
}

