import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateP1ToP2Dto {
  @IsString()
  p1Id: string; // P1Stock.id

  @IsString()
  p2Id: string; // P2Dyeing.id

  @IsOptional() @IsNumber()
  takenWeight?: number;

  @IsOptional() @IsNumber()
  moisture?: number;

  @IsOptional() @IsNumber()
  takenWeightCon?: number;

  @IsOptional() @IsNumber()
  roughWeight?: number;
}
