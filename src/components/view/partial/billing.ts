import { View } from '../../base/view';
import { BillingInfoData, BillingInfoSettings } from '../../../types/components/view/partial/billing';

export class BillingView extends View<BillingInfoData, BillingInfoSettings> {
	private paymentButtons: NodeListOf<HTMLButtonElement>;
	private addressInput: HTMLInputElement;

	constructor(template: string | HTMLTemplateElement | HTMLElement, settings: BillingInfoSettings) {
		super(template, settings);

		this.paymentButtons = this.element.querySelectorAll('.order__buttons .button');
		this.addressInput = this.element.querySelector('input[name="address"]')!;

		this.paymentButtons.forEach(button => {
			button.addEventListener('click', (e) => {
				this.settings.onChange({
					event: e,
					value: {
						paymentMethod: button.name as "online" | "offline",
						address: this.addressInput.value,
					}
				});
			});
		});

		this.addressInput.addEventListener('input', (e) => {
			this.settings.onChange({
				event: e,
				value: {
					paymentMethod: this.settings.paymentMethod as "online" | "offline",
					address: this.addressInput.value
				}
			});
		});
	}

	render(data?: Partial<BillingInfoData>): HTMLElement {
		if (data?.address) this.addressInput.value = data.address;

		this.paymentButtons.forEach(button => {
			button.classList.toggle('button_alt-active', button.name === data?.paymentMethod);
		});

		return this.element;
	}
}
