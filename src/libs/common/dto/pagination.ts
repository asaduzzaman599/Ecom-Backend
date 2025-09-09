import { Transform } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsPositive()
  limit?: number = 10;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  search?: string = null;
}