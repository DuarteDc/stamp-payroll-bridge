import { IsNotEmpty, IsString, IsUppercase, MinLength } from 'class-validator';

export class UpdateTenantDto {
  @IsString()
  @MinLength(5)
  name: string;

  @IsString()
  @IsUppercase()
  @MinLength(12)
  rfc: string;

  @IsString()
  @IsNotEmpty()
  abbreviation: string;
}
