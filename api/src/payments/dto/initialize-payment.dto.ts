import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class InitializePaymentDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsInt()
  @Min(100)
  amountKobo?: number;

  @IsOptional()
  @IsString()
  callbackUrl?: string;
}
