import { View } from '../../base/view';
import { CartData, CartSettings } from '../../../types/components/view/screen/cart';

export class CartScreen extends View<CartData<HTMLElement>, CartSettings> {
	private listElement: HTMLElement;
	private priceElement: HTMLElement;
	private closeButton: HTMLElement;
	private nextButton: HTMLButtonElement;

	constructor(template: string | HTMLTemplateElement | HTMLElement, settings: CartSettings) {
		super(template, settings);

		this.listElement = this.element.querySelector('.basket__list')!;
		this.priceElement = this.element.querySelector('.basket__price')!;
		this.closeButton = this.element.querySelector('.modal__close')!;
		this.nextButton = this.element.querySelector('.basket__button')!;

		this.closeButton.addEventListener('click', this.settings.onClose);
		this.nextButton.addEventListener('click', this.settings.onNext);
	}

	render(data?: Partial<CartData<HTMLElement>>): HTMLElement {
		if (data?.products) this.listElement.replaceChildren(data.products);
		if (data?.total !== undefined) this.priceElement.textContent = `${data.total} синапсов`;

		this.settings.renderItems();
		return this.element;
	}
}
