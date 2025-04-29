import { View } from '../../base/view';
import { ModalSettings, ModalData } from '../../../types/components/view/common/modal';

export class Modal<C> extends View<ModalData<C>, ModalSettings<C>> {
	protected contentElement: HTMLElement;
	protected messageElement: HTMLElement;
	protected actionContainer: HTMLElement;
	protected closeButton: HTMLElement;

	constructor(template: string | HTMLTemplateElement | HTMLElement, settings: ModalSettings<C>) {
		super(template, settings);

		this.contentElement = this.element.querySelector('.modal__content')!;
		this.messageElement = this.element.querySelector('.form__errors') ?? document.createElement('div');
		this.actionContainer = this.element.querySelector('.modal__actions')!;
		this.closeButton = this.element.querySelector('.modal__close')!;

		this.closeButton.addEventListener('click', () => {
			this.settings.onClose();
		});
	}

	render(data?: ModalData<C>): HTMLElement {
		if (!data) return this.element;

		// Очистка и рендер контента
		this.contentElement.replaceChildren(this.settings.contentView.render(data.content));

		// Активность
		this.element.classList.toggle(this.settings.activeClass, data.isActive);

		// Сообщение об ошибке
		if (this.settings.message) {
			this.messageElement.textContent = this.settings.message;
			if (this.settings.isError && this.settings.messageErrorClass) {
				this.messageElement.classList.add(this.settings.messageErrorClass);
			}
			this.contentElement.append(this.messageElement);
		}

		// Экшены
		this.actionContainer.replaceChildren(...this.settings.actions);

		// Триггер открытия
		if (data.isActive) {
			this.settings.onOpen();
		}

		return this.element;
	}
}
