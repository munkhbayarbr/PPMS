import { PartialType } from '@nestjs/swagger';
import { CreateP5WindingDto } from './create-p5-winding.dto';
export class UpdateP5WindingDto extends PartialType(CreateP5WindingDto) {}
