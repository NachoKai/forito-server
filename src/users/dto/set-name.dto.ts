import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SetNameDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}

