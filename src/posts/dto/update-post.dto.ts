import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

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

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  creator: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  privacy: string;

  @IsObject()
  @IsNotEmpty()
  selectedFile: SelectedFileDto;

  @IsArray()
  @IsNotEmpty()
  tags: string[];

  @IsString()
  @IsNotEmpty()
  alt: string;

  @IsArray()
  @IsNotEmpty()
  likes: string[];

  @IsArray()
  @IsNotEmpty()
  saves: string[];

  @IsArray()
  @IsNotEmpty()
  comments: any[];

  @IsDateString()
  @IsNotEmpty()
  createdAt: string;
}

