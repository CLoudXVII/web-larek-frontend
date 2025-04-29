import {
	AppState,
	AppStateSettings,
	AppStateModals,
	AppStateChanges
} from '../../types/components/model/appState';

import {
	Product,
	BillingInfo,
	Contacts,
	Order,
	OrderResponse,
	IProductAPI
} from '../../types/components/model/api';

export class AppStateImpl implements AppState {
	private api: IProductAPI;
	private onChange: (change: AppStateChanges) => void;

	public products = new Map<string, Product>();
	public cart: Product[] = [];
	public cartTotal = 0;
	public address: BillingInfo = { payment: 'offline', address: '' };
	public contacts: Contacts = { email: '', phone: '', payment: 'offline', address: '' };
	public order: Order = { email: '', phone: '', payment: 'offline', address: '', total: 0, items: [] };
	public openedModal: AppStateModals = AppStateModals.none;

	constructor(api: IProductAPI, settings: AppStateSettings) {
		this.api = api;
		this.onChange = settings.onChange;
	}

	async loadProducts(): Promise<void> {
		const response = await this.api.getProductList();
		response.items.forEach(product => this.products.set(product.id, product));
		this.onChange(AppStateChanges.products);
	}

	async loadProductDetails(id: string): Promise<void> {
		const product = await this.api.getProductById(id);
		this.products.set(product.id, product);
		this.onChange(AppStateChanges.selectedProduct);
	}

	updateBillingInfo(billingInfo: Partial<BillingInfo>): void {
		this.address = { ...this.address, ...billingInfo };
		this.order = { ...this.order, ...this.address };
		this.onChange(AppStateChanges.order);
	}

	updateContacts(contacts: Partial<Contacts>): void {
		this.contacts = { ...this.contacts, ...contacts };
		this.order = { ...this.order, ...this.contacts };
		this.onChange(AppStateChanges.order);
	}

	isValidBillingInfo(): boolean {
		return Boolean(this.address.address && this.address.payment);
	}

	isValidContacts(): boolean {
		return Boolean(this.contacts.email && this.contacts.phone);
	}

	async createOrder(): Promise<OrderResponse> {
		this.order.items = this.cart.map(p => p.id);
		this.order.total = this.cartTotal;
		const response = await this.api.createOrder(this.order);
		this.onChange(AppStateChanges.order);
		return response;
	}

	addToCart(product: Product): void {
		this.cart.push(product);
		this._recalcCart();
	}

	removeFromCart(id: string): void {
		this.cart = this.cart.filter(p => p.id !== id);
		this._recalcCart();
	}

	getCartItems(): Product[] {
		return this.cart;
	}

	openModal(modal: AppStateModals): void {
		this.openedModal = modal;
		this.onChange(AppStateChanges.modal);
	}

	clearData(): void {
		this.cart = [];
		this.cartTotal = 0;
		this.address = { payment: 'offline', address: '' };
		this.contacts = { email: '', phone: '', payment: 'offline', address: '' };
		this.order = { email: '', phone: '', payment: 'offline', address: '', total: 0, items: [] };
		this.onChange(AppStateChanges.modal);
		this.onChange(AppStateChanges.cart);
		this.onChange(AppStateChanges.order);
	}

	private _recalcCart(): void {
		this.cartTotal = this.cart.reduce((sum, p) => sum + (p.price || 0), 0);
		this.onChange(AppStateChanges.cart);
	}
}
