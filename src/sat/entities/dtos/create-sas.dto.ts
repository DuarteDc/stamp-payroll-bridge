import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateSasDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  sas: string;

  @IsString()
  @MinLength(3)
  containerName: string;
}
