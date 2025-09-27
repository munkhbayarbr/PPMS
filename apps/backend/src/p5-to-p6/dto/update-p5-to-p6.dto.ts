import { PartialType } from '@nestjs/swagger';
import { CreateP5ToP6Dto } from './create-p5-to-p6.dto';
export class UpdateP5ToP6Dto extends PartialType(CreateP5ToP6Dto) {}
