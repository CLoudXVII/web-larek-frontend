import { IView } from '../../types/components/base/view';
import { cloneTemplate } from '../../utils/utils';

/**
 * Базовая реализация интерфейса отображения
 */
export abstract class View<T, S = object> implements IView<T, S> {
	public readonly element: HTMLElement;
	protected settings: S;

	constructor(template: string | HTMLTemplateElement | HTMLElement, settings: S) {
		this.settings = settings;

		if (template instanceof HTMLElement && !(template instanceof HTMLTemplateElement)) {
			this.element = template;
		} else {
			this.element = cloneTemplate<HTMLElement>(template);
		}
	}

	/**
	 * Копирует отображение с новым элементом и (опционально) настройками
	 */
	copy(settings?: S): IView<T> {
		const newElement = this.element.cloneNode(true) as HTMLElement;
		const Constructor = this.constructor as new (el: HTMLElement, settings: S) => IView<T>;
		return new Constructor(newElement, settings ?? this.settings);
	}

	/**
	 * Абстрактный метод рендера — переопределяется в наследниках
	 */
	abstract render(data?: Partial<T>): HTMLElement;
}
