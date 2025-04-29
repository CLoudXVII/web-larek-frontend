import { View } from '../../base/view';
import { ButtonData, ButtonSettings } from '../../../types/components/view/common/button';
import { IClickableEvent } from '../../../types/components/base/view';

export class Button<T = unknown> extends View<ButtonData, ButtonSettings<T>> {
	constructor(template: string | HTMLTemplateElement | HTMLElement, settings: ButtonSettings<T>) {
		super(template, settings);

		this.element.addEventListener('click', (event) => {
			this.settings.onClick?.({
				event,
				item: this.settings as unknown as T
			} satisfies IClickableEvent<T>);
		});
	}

	render(data?: Partial<ButtonData>): HTMLElement {
		if (data?.label !== undefined) {
			this.element.textContent = data.label;
		}
		if (data?.disabled !== undefined) {
			this.element.toggleAttribute('disabled', data.disabled);
		}
		return this.element;
	}
}
