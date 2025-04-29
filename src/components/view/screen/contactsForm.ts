import { View } from '../../base/view';
import { ContactsFormData, ContactsFormSettings } from '../../../types/components/view/screen/contactsForm';

export class ContactsForm extends View<ContactsFormData, ContactsFormSettings> {
	private closeButton: HTMLElement;
	private nextButton: HTMLButtonElement;

	constructor(template: string | HTMLTemplateElement | HTMLElement, settings: ContactsFormSettings) {
		super(template, settings);

		this.closeButton = this.element.querySelector('.modal__close')!;
		this.nextButton = this.element.querySelector('button[type="submit"]')!;

		this.closeButton.addEventListener('click', this.settings.onClose);
		this.nextButton.addEventListener('click', this.settings.onNext);
	}

	render(data?: ContactsFormData): HTMLElement {
		if (!data) return this.element;

		this.nextButton.disabled = !(data.contacts?.email && data.contacts?.phone);

		if (data.message) {
			const msg = this.element.querySelector('.form__errors')!;
			msg.textContent = data.message;
			msg.classList.toggle('form__error', data.isError);
		}

		this.element.classList.toggle('modal_active', data.isActive);
		return this.element;
	}
}
