import { IsString } from 'class-validator';

export class SelectDatabasesDto {
  @IsString()
  candidatesDbId!: string;

  @IsString()
  rolesDbId!: string;

  @IsString()
  stagesDbId!: string;
}
