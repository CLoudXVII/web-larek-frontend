export interface MainData<C extends HTMLElement> {
  counter: number;
  cartButton: string;
  cartContent: C;
}

export interface MainSettings {
  onOpenCart: () => void;
  renderItems: () => void;
}
