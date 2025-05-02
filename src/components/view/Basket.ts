import { IBasket } from '../../types';
import { Modal } from '../common/Modal';
import { IEvents } from '../base/Events';
import { settings } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class Basket extends Modal<IBasket> {
	private basketList: HTMLUListElement;
	private basketTotalPrice: HTMLElement;
	private checkoutButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container, events);

		this.basketList = ensureElement<HTMLUListElement>(
			settings.basketList,
			this.container
		);
		this.basketTotalPrice = ensureElement<HTMLElement>(
			settings.basketTotalPrice,
			this.container
		);
		this.checkoutButton = ensureElement<HTMLButtonElement>(
			settings.basketConfirmButton,
			this.container
		);
	}

	render(data: IBasket): HTMLElement {
		this.basketList.replaceChildren(...data.items);

		this.setText(this.basketTotalPrice, `${data.total} синапсов`);
		this.checkoutButton.disabled = data.items.length === 0;

		this.checkoutButton.onclick = () => {
			this.events.emit('basket:order');
		};

		return this.container;
	}
}
