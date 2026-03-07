import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class InitializePaymentDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsInt()
  @Min(100)
  amount?: number;

  @IsOptional()
  @IsString()
  callbackUrl?: string;
}
