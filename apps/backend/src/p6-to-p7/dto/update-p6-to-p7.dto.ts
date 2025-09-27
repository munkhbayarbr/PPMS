import { PartialType } from '@nestjs/swagger';
import { CreateP6ToP7Dto } from './create-p6-to-p7.dto';
export class UpdateP6ToP7Dto extends PartialType(CreateP6ToP7Dto) {}
