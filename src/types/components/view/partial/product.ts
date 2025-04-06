export interface ProductData {
  id: string;
  title: string;
  category: string;
  price: number | null;
  image: string;
}

export interface ProductSettings {
  id: string;
  title: string;
  category: string;
  price: number | null;
  image: string;

  // Для корзины
  delete?: string;
  compactClass: string;
  isCompact: boolean;
}
