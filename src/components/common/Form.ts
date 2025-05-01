import { Modal } from './Modal';
import { IEvents } from '../base/Events';
import { settings } from '../../utils/constants';
import { ensureAllElements, ensureElement } from '../../utils/utils';

interface IForm {
	valid: boolean;
	inputValues: Record<string, string>;
	error: Record<string, string>;
}

export class Form extends Modal<IForm> {
	protected inputs: HTMLInputElement[];
	protected _form: HTMLFormElement;
	protected errors: Record<string, string>;
	protected formName: string;
	protected submitButton: HTMLButtonElement;
	protected errorSpan: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.inputs = ensureAllElements<HTMLInputElement>(
			settings.formInput,
			this.container
		);
		this._form = ensureElement<HTMLFormElement>(settings.form, this.container);
		this.formName = this._form.getAttribute('name');
		this.submitButton = ensureElement<HTMLButtonElement>(
			settings.formSubmit,
			this._form
		);
		this.errorSpan = ensureElement<HTMLElement>(settings.formError, this._form);

		this._form.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit(`${this.formName}:submit`, this.getInputValues());
		});

		this._form.addEventListener('input', (event: InputEvent) => {
			const target = event.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;

			if (value.trim() !== '') {
				this.hideInputError();
			}
			this.validateForm();
			this.events.emit(`${this.formName}:input`, { field, value });
		});
	}

	protected getInputValues() {
		const valuesObject: Record<string, string> = {};
		this.inputs.forEach((element) => {
			valuesObject[element.name] = element.value;
		});
		return valuesObject;
	}

	set inputValues(data: Record<string, string>) {
		this.inputs.forEach((element) => {
			element.value = data[element.name];
		});
	}

	set error(data: { field: string; value: string; validInformation: string }) {
		if (data.validInformation) {
			this.showInputError();
		} else {
			this.hideInputError();
		}
	}

	protected showInputError() {
		this.setText(this.errorSpan, 'Заполните все поля');
	}

	protected hideInputError() {
		this.setText(this.errorSpan, '');
	}

	protected validateForm() {
		let isValid = true;
		const errors: string[] = [];
	
		this.inputs.forEach((input) => {
			if (input.value.trim() === '') {
				isValid = false;
				errors.push(`Поле "${input.name}" обязательно`);
			}
		});
	
		this.setText(this.errorSpan, errors.join(', '));
		this.valid = isValid;
	}
	

	public setFormData(data: Record<string, string>) {
		this.inputValues = data;
		this.validateForm();
	}	

	set valid(isValid: boolean) {
		this.submitButton.classList.toggle('disabled', !isValid);
		this.submitButton.disabled = !isValid;
	}

	get form() {
		return this._form;
	}

	close() {
		super.close();
		this._form.reset();
		this.errors = {};
		this.hideInputError();
	}
}
