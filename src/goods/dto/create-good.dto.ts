export class CreateGoodDto {
  title: string;
  description: string;
  imageUrls?: string[];
  price: number;
  isActive?: boolean;
  typeId: string;
  categoryId: string;
  subCategoryId?: string;
}
