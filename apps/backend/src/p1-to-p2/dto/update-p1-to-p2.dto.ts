import { PartialType } from '@nestjs/mapped-types';
import { CreateP1ToP2Dto } from './create-p1-to-p2.dto';

export class UpdateP1ToP2Dto extends PartialType(CreateP1ToP2Dto) {}
