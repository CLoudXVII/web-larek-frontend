import { Modal } from '.././common/Modal';
import { IEvents } from '.././base/Events';
import { settings } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export interface ISuccess {
	total: number;
}

export class Success extends Modal<ISuccess> {
	protected basketTotal: HTMLElement;
	protected sucessButton: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		// Элемент для отображения общей суммы
		this.basketTotal = ensureElement<HTMLElement>(
			settings.orderSuccessDesc,
			container
		);
		this.sucessButton = ensureElement<HTMLButtonElement>(
			settings.orderSuccessClose,
			container
		);

		this.sucessButton.addEventListener('click', () => {
			this.close();
		});
	}

	render(data: Partial<ISuccess>): HTMLElement {
		super.render(data);
		this.setText(this.basketTotal, `Списано ${data.total} синапсов`);
		this.events.emit(`success:submit`);

		return this.container;
	}
}
