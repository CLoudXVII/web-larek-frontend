import { IEvents } from '../base/Events';
import { Component } from '../base/Component';
import { settings } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class Modal<T> extends Component<T> {
	protected modal: HTMLElement;
	protected events: IEvents;
	protected content: T | null = null;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		const closeButtonElement = ensureElement<HTMLButtonElement>(
			settings.modalCloseButton,
			this.container
		);
		closeButtonElement.addEventListener('click', this.close.bind(this));

		this.container.addEventListener('mousedown', (evt) => {
			if (evt.target === evt.currentTarget) {
				this.close();
			}
		});
		this.handleEscUp = this.handleEscUp.bind(this);
	}

	open() {
		this.container.classList.add(settings.modalActiveClass);
		document.addEventListener('keyup', this.handleEscUp);
	}

	close() {
		this.container.classList.remove(settings.modalActiveClass);
		this.content = null;
		document.removeEventListener('keyup', this.handleEscUp);
	}

	handleEscUp(evt: KeyboardEvent) {
		if (evt.key === 'Escape') {
			this.close();
		}
	}
}
