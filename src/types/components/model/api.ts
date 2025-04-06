export type ApiListResponse<Type> = {
  total: number;
  items: Type[];
};

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
}

export interface BillingInfo {
  payment: "online" | "offline";
  address: string;
}

export interface Contacts extends BillingInfo {
  email: string;
  phone: string;
}

export interface Order extends Contacts {
  total: number;
  items: string[];
}

export interface OrderResponse {
  id: string;
  total: number;
}

export interface IProductAPI {
  getProductList: () => Promise<ApiListResponse<Product>>;
  getProductById: (id: string) => Promise<Product>;
  createOrder: (order: Order) => Promise<OrderResponse>;
}
