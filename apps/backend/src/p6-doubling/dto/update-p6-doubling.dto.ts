import { PartialType } from '@nestjs/swagger';
import { CreateP6DoublingDto } from './create-p6-doubling.dto';
export class UpdateP6DoublingDto extends PartialType(CreateP6DoublingDto) {}
