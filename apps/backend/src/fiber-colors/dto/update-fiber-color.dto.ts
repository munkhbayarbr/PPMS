import { PartialType } from '@nestjs/swagger';
import { CreateFiberColorDto } from './create-fiber-color.dto';

export class UpdateFiberColorDto extends PartialType(CreateFiberColorDto) {}
