import { IsString, IsOptional } from 'class-validator';

export class CreateReferenceDto {
  @IsString()
  referenceText: string;

  @IsOptional()
  @IsString()
  targetArticleNumber?: string;

  @IsOptional()
  @IsString()
  referenceType?: string;

  @IsOptional()
  @IsString()
  externalUrl?: string;
}