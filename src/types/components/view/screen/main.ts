import { CardData } from "../partial/card";

export interface MainData {
  counter: number;
  items: CardData[];
}

export interface MainSettings {
  onOpenCart: () => void;
  onOpenProduct: (id: string) => void;
}
