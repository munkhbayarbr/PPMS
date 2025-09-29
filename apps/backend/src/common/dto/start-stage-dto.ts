import { IsNumber, IsOptional, IsString } from 'class-validator';

export class StartStageDto {
  @IsString()
  orderId!: string;

  @IsNumber()
  stageIndex!: number;

  // If you want to record who started (optional; only use if your OrderStage has startedByUserId)
  @IsOptional()
  @IsString()
  userId?: string;
}
