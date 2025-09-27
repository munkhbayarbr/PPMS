import { PartialType } from '@nestjs/swagger';
import { CreateBobbinDto } from './create-bobbin.dto';

export class UpdateBobbinDto extends PartialType(CreateBobbinDto) {}
