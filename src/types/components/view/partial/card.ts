import { IClickable } from "../../base/view";

export interface CardData {
  id: string;
  title: string;
  category: string;
  price: number | null;
  image: string;
}

export interface CardSettings extends IClickable<CardData> {
  title: string;
  category: string;
  price: string;
  image: string;
}
