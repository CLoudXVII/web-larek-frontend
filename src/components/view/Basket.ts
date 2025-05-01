import { Item } from './Item';
import { IItem } from '../../types';
import { Modal } from '../common/Modal';
import { IEvents } from '../base/Events';
import { settings } from '../../utils/constants';
import { ensureElement, cloneTemplate } from '../../utils/utils';

export class Basket extends Modal<IItem[]> {
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

	render(items: IItem[]): HTMLElement {
		this.basketList.innerHTML = '';

		items.forEach((item, index) => {
			const el = cloneTemplate<HTMLElement>(settings.basketTemplate);
			const instance = new Item(el, this.events);
			instance.render(item);

			const indexEl = ensureElement<HTMLElement>(settings.basketItemIndex, el);
			indexEl.textContent = (index + 1).toString();

			const removeBtn = ensureElement<HTMLButtonElement>(settings.basketItemDelete, el);
			removeBtn.addEventListener('click', (e) => {
				this.events.emit('basket:remove-item', { id: item.id });
				e.stopPropagation();
			});

			this.basketList.append(el);
		});

		const total = items.reduce((sum, i) => sum + i.price, 0);
		this.setText(this.basketTotalPrice, `${total} синапсов`);
		this.checkoutButton.disabled = items.length === 0;

		this.checkoutButton.onclick = () => {
			this.events.emit('basket:order');
		};

		return this.container;
	}
}
