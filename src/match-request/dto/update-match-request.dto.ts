import { IsEnum, IsNotEmpty } from 'class-validator';
import { MatchRequestStatus } from '../schemas/match-request.schema';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMatchRequestQueryDto {
  @ApiProperty({
    enum: MatchRequestStatus,
    description: 'The new status for the match request.',
    example: MatchRequestStatus.ACCEPTED,
  })
  @IsNotEmpty()
  @IsEnum(MatchRequestStatus)
  status: MatchRequestStatus;
}
