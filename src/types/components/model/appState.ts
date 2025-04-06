import { IProductAPI, BillingInfo, Contacts, Order, OrderResponse, Product } from './api';

// Возможные типы модальных окон
export enum AppStateModals {
  productPreview = 'modal:product-preview',
  cart = 'modal:cart',
  paymentMethod = 'modal:payment-method',
  contactInfo = 'modal:contact-info',
  success = 'modal:success',
  none = 'modal:none',
}

// Возможные изменения состояния приложения
export enum AppStateChanges {
  products = 'change:products',
  modal = 'change:modal',
  selectedProduct = 'change:selected-product',
  cart = 'change:cart',
  order = 'change:order',
}

// Модель данных приложения
export interface AppState {
  // Серверные данные
  products: Map<string, Product>;

  // Пользовательские данные
  cart: Product[];
  cartTotal: number;
  address: BillingInfo;
  contacts: Contacts;
  order: Order;
  openedModal: AppStateModals;

  // Действия с каталогом
  loadProducts(): Promise<void>;
  loadProductDetails(id: string): Promise<void>;

  // Действия покупателя
  updateBillingInfo(billingInfo: Partial<BillingInfo>): void;
  updateContacts(contacts: Partial<Contacts>): void;
  isValidBillingInfo(): boolean;
  isValidContacts(): boolean;
  createOrder(): Promise<OrderResponse>;

  // Действия с корзиной
  addToCart(product: Product): void;
  removeFromCart(id: string): void;
  getCartItems(): Product[];

  // Действия с модальными окнами
  openModal(modal: AppStateModals): void;
  clearData(): void;
}

// Настройки модели данных
export interface AppStateSettings {
  onChange: (changed: AppStateChanges) => void;
}

// Конструктор модели данных
export interface AppStateConstructor {
  new (api: IProductAPI, settings: AppStateSettings): AppState;
}
