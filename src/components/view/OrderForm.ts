import { Form } from '../common/Form';
import { IUserData } from '../../types';
import { IEvents } from '../base/Events';
import { settings } from '../../utils/constants';
import { ensureAllElements } from '../../utils/utils';

export class OrderForm extends Form {
	private paymentButtons: HTMLButtonElement[];

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this.paymentButtons = ensureAllElements<HTMLButtonElement>(
			`${settings.formOrderButton} ${settings.button}`,
			this.container
		);
		this.paymentButtons.forEach((button) => {
			button.addEventListener(
				'click',
				this.handlePaymentMethodSelect.bind(this)
			);
		});

		this.validateForm();
	}

	private handlePaymentMethodSelect(event: MouseEvent) {
		const target = event.target as HTMLButtonElement;

		this.paymentButtons.forEach((button) =>
			button.classList.remove(settings.formActiveButtonClass)
		);

		target.classList.add(settings.formActiveButtonClass);

		this.events.emit('order:payment-method-selected', { method: target.name });

		this.validateForm();
	}

	private formErrors: string[] = [];

	protected validateForm() {
		let isValid = true;
		this.formErrors = [];
	
		this.inputs.forEach((input) => {
			if (input.value.trim() === '') {
				isValid = false;
				this.formErrors.push(`Поле "${input.name}" обязательно`);
			}
		});

		const activePaymentButton = this.container.querySelector(
			`${settings.formOrderButton} .${settings.formActiveButtonClass}`
		);
	
		if (!activePaymentButton) {
			isValid = false;
			this.formErrors.push('Выберите способ оплаты');
		}
	
		this.setText(this.errorSpan, this.formErrors.join(', '));
		this.valid = isValid;
	}	

	public setFormData(data: Partial<IUserData>) {
		if (data.address) {
			this.inputValues = { address: data.address };
		}
	
		if (data.payment) {
			const methodName = data.payment === 'online' ? 'card' : 'cash';
			const button = this.paymentButtons.find(btn => btn.name === methodName);
			if (button) {
				this.paymentButtons.forEach(btn =>
					btn.classList.remove(settings.formActiveButtonClass)
				);
				button.classList.add(settings.formActiveButtonClass);
			}
		}
	
		this.validateForm();
	}	

	set valid(isValid: boolean) {
		super.valid = isValid;
	}
}
