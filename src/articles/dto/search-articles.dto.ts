import { IsString, IsOptional, IsNumber, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchArticlesDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  articleNumber?: string;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @IsIn(['articleNumber', 'title', 'createdAt'])
  sortBy?: string = 'articleNumber';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: string = 'asc';
}