import { View } from '../../base/view';
import { SuccessData, SuccessSettings } from '../../../types/components/view/screen/success';

export class SuccessScreen extends View<SuccessData, SuccessSettings> {
	private closeButton: HTMLElement;
	private descElement: HTMLElement;

	constructor(template: string | HTMLTemplateElement | HTMLElement, settings: SuccessSettings) {
		super(template, settings);

		this.descElement = this.element.querySelector('.film__description, .order-success__description')!;
		this.closeButton = this.element.querySelector('.order-success__close')!;

		this.closeButton.addEventListener('click', this.settings.onClose);
	}

	render(data?: SuccessData): HTMLElement {
		if (!data) return this.element;

		this.descElement.textContent = `Списано ${data.total} синапсов`;
		this.element.classList.toggle('modal_active', data.isActive);
		return this.element;
	}
}
