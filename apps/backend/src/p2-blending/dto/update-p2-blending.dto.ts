import { PartialType } from '@nestjs/swagger';
import { CreateP2BlendingDto } from './create-p2-blending.dto';
export class UpdateP2BlendingDto extends PartialType(CreateP2BlendingDto) {}
