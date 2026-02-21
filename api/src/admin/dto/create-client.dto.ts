import { IsEnum, IsString } from 'class-validator';
import { ProductType } from '@prisma/client';

export class CreateClientDto {
  @IsEnum(ProductType)
  productType!: ProductType;

  @IsString()
  companyName!: string;

  @IsString()
  clientSlug!: string;
}
