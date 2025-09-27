import { PartialType } from '@nestjs/mapped-types';
import { CreateOutColorDto } from './create-out-color.dto';

export class UpdateOutColorDto extends PartialType(CreateOutColorDto) {}
