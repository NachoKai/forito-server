import { IsEmail, IsNotEmpty, IsObject } from "class-validator";

class EmailObject {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class SetEmailDto {
  @IsObject()
  @IsNotEmpty()
  email: EmailObject;
}
