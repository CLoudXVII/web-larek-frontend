import { ProductData } from "../partial/product";

export interface CartData {
  products: ProductData[];
  total: number;
}

export interface CartSettings {
  onRemove: (id: string) => void;
  onClose: () => void;
  onNext: () => void;
}
