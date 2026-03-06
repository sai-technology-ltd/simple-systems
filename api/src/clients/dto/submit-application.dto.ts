import { IsEmail, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class SubmitApplicationDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsUrl(
    {
      require_protocol: true,
    },
    {
      message: 'cvUrl must be a valid URL',
    },
  )
  cvUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
