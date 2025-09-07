import { StockCreateDto } from 'src/stocks/dto/stock-create.dto';

export class CreateGoodDto {
  title: string;
  description: string;
  imageUrls?: string[];
  price: number;
  stocks: StockCreateDto[];
  isActive?: boolean;
  typeId?: string;
  categoryId?: string;
  subCategoryId?: string;
}
