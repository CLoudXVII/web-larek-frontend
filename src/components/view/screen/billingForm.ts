import { View } from '../../base/view';
import { BillingFormData, BillingFormSettings } from '../../../types/components/view/screen/billingForm';

export class BillingForm extends View<BillingFormData, BillingFormSettings> {
	private closeButton: HTMLElement;
	private nextButton: HTMLButtonElement;

	constructor(template: string | HTMLTemplateElement | HTMLElement, settings: BillingFormSettings) {
		super(template, settings);

		this.closeButton = this.element.querySelector('.modal__close')!;
		this.nextButton = this.element.querySelector('.order__button')!;

		this.closeButton.addEventListener('click', this.settings.onClose);
		this.nextButton.addEventListener('click', this.settings.onNext);
	}

	render(data?: BillingFormData): HTMLElement {
		if (!data) return this.element;

		this.nextButton.disabled = !(data.info?.address && data.info?.paymentMethod);

		if (data.message) {
			const msg = this.element.querySelector('.form__errors')!;
			msg.textContent = data.message;
			msg.classList.toggle('form__error', data.isError);
		}

		this.element.classList.toggle('modal_active', data.isActive);
		return this.element;
	}
}
