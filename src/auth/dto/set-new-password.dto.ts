import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SetNewPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty({ minLength: 6 })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  path: string;
}
