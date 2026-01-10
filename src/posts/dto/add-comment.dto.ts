import { IsNotEmpty, IsObject } from "class-validator";

export class AddCommentDto {
  @IsObject()
  @IsNotEmpty()
  value: {
    userId?: string;
    name?: string;
    comment?: string;
    commentId?: string;
  };
}
