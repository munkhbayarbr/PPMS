import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EmployeeRolesService } from './employee-roles.service';
import { AssignRoleDto } from './dto/assign-role.dto';

@ApiTags('employee-roles')
@ApiBearerAuth()
@Controller('employee-roles')
export class EmployeeRolesController {
  constructor(private service: EmployeeRolesService) {}

  @Post('assign') assign(@Body() dto: AssignRoleDto) { return this.service.assign(dto); }
  @Delete(':userId/:roleId') unassign(@Param('userId') userId: string, @Param('roleId') roleId: string) {
    return this.service.unassign(userId, roleId);
  }
  @Get('by-user/:userId') byUser(@Param('userId') userId: string) { return this.service.byUser(userId); }
  @Get('by-role/:roleId') byRole(@Param('roleId') roleId: string) { return this.service.byRole(roleId); }
}
