import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';

export const DEFAULT_PAGE_SIZE = 20;

class BasePagination {
  /*
   * Maximum number of records to be returned
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform((params) => Number(params.value))
  limit?: number = DEFAULT_PAGE_SIZE;

  /**
   * Number of records to be skipped
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform((params) => Number(params.value))
  offset?: number = 0;
}

export abstract class PaginatedList<T> extends BasePagination {
  /*
   * Total number of records existent in the store
   */
  total: number;

  /*
   * Whether there are more records to be fetched
   */
  hasMore: boolean;

  data: T[];
}

export class PaginatedListInput extends BasePagination {
  // INFO: the @Matches decorator messes up the swagger docs
  @ApiProperty({
    description: 'Allows for sorting using field1:asc&field:desc',
    required: false,
  })
  @Matches(RegExp('(^&?.+:desc$)|(^&?.+:asc$)'), {
    message: 'Sort must be in the format of field1:asc&field2:desc',
  })
  @IsOptional()
  @IsString()
  sort?: string;
}
