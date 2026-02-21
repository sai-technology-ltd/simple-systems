import { IsEmail, IsOptional, IsString } from 'class-validator';

export class HiringIntakeDto {
  @IsString()
  roleId!: string;

  @IsString()
  candidateName!: string;

  @IsEmail()
  candidateEmail!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  cvUrl?: string;

  @IsOptional()
  @IsString()
  submissionId?: string;
}
