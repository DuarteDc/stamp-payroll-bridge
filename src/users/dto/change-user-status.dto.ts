import { IsEnum, IsNotEmpty } from 'class-validator';
import { CommonEntityStatus } from 'src/common/types/common-entity-status.type';

export class ChangeUserStatusDto {
  @IsEnum(CommonEntityStatus)
  @IsNotEmpty()
  status: string;
}
