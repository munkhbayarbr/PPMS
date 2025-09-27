import { PartialType } from '@nestjs/swagger';
import { CreateTraceDto } from './create-trace.dto';

export class UpdateTraceDto extends PartialType(CreateTraceDto) {}
