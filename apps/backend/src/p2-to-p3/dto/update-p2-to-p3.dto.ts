import { PartialType } from '@nestjs/swagger';
import { CreateP2ToP3Dto } from './create-p2-to-p3.dto';

export class UpdateP2ToP3Dto extends PartialType(CreateP2ToP3Dto) {}
