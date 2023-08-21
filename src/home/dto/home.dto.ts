import { PropertyType } from '@prisma/client';

export class HomeResponseDto {
  id: number;
  address: string;
  number_of_bedroom: number;
  number_of_bathrooms: number;
  city: string;
  listed_date: Date;
  price: number;
  land_size: number;
  propertyType: PropertyType;
  craeted_at: Date;
  update_at: Date;
  realtor_id: number;
}
