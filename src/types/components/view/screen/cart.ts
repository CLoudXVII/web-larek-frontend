export interface CartData<C extends HTMLElement> {
  products: C;
  total: number;
}

export interface CartSettings {
  onClose: () => void;
  onNext: () => void;
  renderItems: () => void;
}
