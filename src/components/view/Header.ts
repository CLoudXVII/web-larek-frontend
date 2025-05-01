import { IEvents } from '../base/Events';
import { settings } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class HeaderView {
	private counterElement: HTMLElement;
	private basketButton: HTMLButtonElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		this.counterElement = ensureElement<HTMLElement>(settings.basketCounter, container);
		this.basketButton = ensureElement<HTMLButtonElement>(settings.basketOpenButton, container);

		this.basketButton.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	setBasketCount(count: number) {
		this.counterElement.textContent = count.toString();
	}
}
