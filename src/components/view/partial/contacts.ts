import { View } from '../../base/view';
import { ContactsData, ContactsSettings } from '../../../types/components/view/partial/contacts';

export class ContactsView extends View<ContactsData, ContactsSettings> {
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;

	constructor(template: string | HTMLTemplateElement | HTMLElement, settings: ContactsSettings) {
		super(template, settings);

		this.emailInput = this.element.querySelector('input[name="email"]')!;
		this.phoneInput = this.element.querySelector('input[name="phone"]')!;

		this.emailInput.addEventListener('input', (e) => {
			this.settings.onChange({
				event: e,
				value: {
					email: this.emailInput.value,
					phone: this.phoneInput.value
				}
			});
		});

		this.phoneInput.addEventListener('input', (e) => {
			this.settings.onChange({
				event: e,
				value: {
					email: this.emailInput.value,
					phone: this.phoneInput.value
				}
			});
		});
	}

	render(data?: Partial<ContactsData>): HTMLElement {
		if (data?.email !== undefined) this.emailInput.value = data.email;
		if (data?.phone !== undefined) this.phoneInput.value = data.phone;

		return this.element;
	}
}
