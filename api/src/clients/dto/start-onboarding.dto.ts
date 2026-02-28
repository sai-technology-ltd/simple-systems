import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class StartOnboardingDto {
  @IsString()
  @MinLength(2)
  companyName!: string;

  @IsOptional()
  @IsEmail()
  replyToEmail?: string;
}
