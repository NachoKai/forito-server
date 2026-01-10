import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class SelectedFileDto {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  id?: string;
}

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  privacy?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsObject()
  @IsOptional()
  selectedFile?: SelectedFileDto;

  @IsString()
  @IsOptional()
  alt?: string;
}
