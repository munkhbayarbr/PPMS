import { PartialType } from '@nestjs/swagger';
import { CreateP7TwistingDto } from './create-p7-twisting.dto';
export class UpdateP7TwistingDto extends PartialType(CreateP7TwistingDto) {}
