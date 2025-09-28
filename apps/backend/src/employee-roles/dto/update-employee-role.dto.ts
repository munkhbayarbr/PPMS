import { PartialType } from '@nestjs/swagger';
import { CreateEmployeeRoleDto } from './create-employee-role.dto';

export class UpdateEmployeeRoleDto extends PartialType(CreateEmployeeRoleDto) {}
