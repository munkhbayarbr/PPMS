import { PartialType } from '@nestjs/swagger';
import { CreateP3ToP4Dto } from './create-p3-to-p4.dto';

export class UpdateP3ToP4Dto extends PartialType(CreateP3ToP4Dto) {}
