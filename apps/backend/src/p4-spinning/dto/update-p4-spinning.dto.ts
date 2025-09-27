import { PartialType } from '@nestjs/swagger';
import { CreateP4SpinningDto } from './create-p4-spinning.dto';

export class UpdateP4SpinningDto extends PartialType(CreateP4SpinningDto) {}
