import { IsArray, IsNotEmpty } from "class-validator";

export class UpdateNotificationsDto {
  @IsArray()
  @IsNotEmpty()
  notifications: any[];
}
