import { PartialType } from '@nestjs/swagger';
import { CreateP4ToP5Dto } from './create-p4-to-p5.dto';
export class UpdateP4ToP5Dto extends PartialType(CreateP4ToP5Dto) {}
