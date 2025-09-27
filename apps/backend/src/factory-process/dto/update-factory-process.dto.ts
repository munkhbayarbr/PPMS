import { PartialType } from '@nestjs/swagger';
import { CreateFactoryProcessDto } from './create-factory-process.dto';

export class UpdateFactoryProcessDto extends PartialType(CreateFactoryProcessDto) {}
