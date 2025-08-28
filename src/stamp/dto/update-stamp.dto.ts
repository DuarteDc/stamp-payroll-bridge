import { PartialType } from '@nestjs/mapped-types';
import { CreateStampDto } from './create-stamp.dto';

export class UpdateStampDto extends PartialType(CreateStampDto) {}
