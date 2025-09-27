import { PartialType } from '@nestjs/swagger';
import { CreateP3CardingDto } from './create-p3-carding.dto';

export class UpdateP3CardingDto extends PartialType(CreateP3CardingDto) {}
