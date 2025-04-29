import {
	IProductAPI,
	ApiListResponse,
	Product,
	Order,
	OrderResponse
} from '../../types/components/model/api';
import { Api } from '../base/api';

export class ProductAPI implements IProductAPI {
	private api: Api;

	constructor(api: Api) {
		this.api = api;
	}
    
	/**
	 * Получить список всех продуктов
	 */
	getProductList(): Promise<ApiListResponse<Product>> {
		return this.api.get('/product') as Promise<ApiListResponse<Product>>;
	}

	/**
	 * Получить подробности продукта по ID
	 */
	getProductById(id: string): Promise<Product> {
		return this.api.get(`/product/${id}`) as Promise<Product>;
	}

	/**
	 * Создать заказ
	 */
	createOrder(order: Order): Promise<OrderResponse> {
		return this.api.post('/order', order) as Promise<OrderResponse>;
	}
}
