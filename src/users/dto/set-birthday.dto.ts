import { IsNotEmpty, Matches } from "class-validator";

export class SetBirthdayDto {
  @IsNotEmpty()
  @Matches(/^\d{4}\/\d{2}\/\d{2}$/, {
    message: "Invalid birthday format. Use yyyy/mm/dd",
  })
  birthday: string;
}
