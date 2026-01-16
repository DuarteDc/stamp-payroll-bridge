import { IsString, MinLength } from 'class-validator';

export class UpdateUserDataDto {
  @IsString()
  @MinLength(5)
  name: string;

  @IsString()
  @MinLength(8)
  username: string;
}
