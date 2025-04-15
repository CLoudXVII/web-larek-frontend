import { CardData } from "../partial/card";

export interface CartData {
  products: CardData[];
  total: number;
}

export interface CartSettings {
  onClose: () => void;
  onNext: () => void;
}
