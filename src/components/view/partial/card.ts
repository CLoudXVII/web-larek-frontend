import { View } from '../../base/view';
import { CardData, CardSettings } from '../../../types/components/view/partial/card';

export class CardView extends View<CardData, CardSettings> {
	constructor(template: string | HTMLTemplateElement | HTMLElement, settings: CardSettings) {
		super(template, settings);

		this.element.addEventListener('click', (event) => {
			const isDelete = (event.target as HTMLElement).closest(this.settings.delete || '');
			if (isDelete) {
				this.settings.onClick({ event, item: this.data });
			} else {
				this.settings.onOpenCard(this.data.id);
			}
		});
	}

	private data: CardData;

	render(data?: Partial<CardData>): HTMLElement {
		if (data) this.data = { ...this.data, ...data } as CardData;

		const title = this.element.querySelector('.card__title');
		const category = this.element.querySelector('.card__category');
		const price = this.element.querySelector('.card__price');
		const image = this.element.querySelector('.card__image') as HTMLImageElement;

		if (title) title.textContent = this.settings.title;
		if (category) category.textContent = this.settings.category;
		if (price) price.textContent = this.settings.price;
		if (image) image.src = this.settings.image;

		if (this.settings.isCompact) {
			this.element.classList.add(this.settings.compactClass);
		} else {
			this.element.classList.remove(this.settings.compactClass);
		}

		return this.element;
	}
}
