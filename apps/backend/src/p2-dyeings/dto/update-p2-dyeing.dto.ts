import { PartialType } from '@nestjs/mapped-types';
import { CreateP2DyeingDto } from './create-p2-dyeing.dto';

export class UpdateP2DyeingDto extends PartialType(CreateP2DyeingDto) {}
