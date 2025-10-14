import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateReferenceDto } from './create-reference.dto';

export class CreateArticleDto {
  @IsString()
  articleNumber: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  section?: string;

  @IsOptional()
  @IsString()
  chapter?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  modificationReason?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReferenceDto)
  references?: CreateReferenceDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagNames?: string[];
}