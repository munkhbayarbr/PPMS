import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkflowTemplateDto } from './create-workflow-template.dto';

export class UpdateWorkflowTemplateDto extends PartialType(CreateWorkflowTemplateDto) {}
