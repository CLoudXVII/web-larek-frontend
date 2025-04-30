import { IItem } from '../../types/index';
import { IEvents } from '.././base/Events';
import { Component } from '.././base/Component';
import { ensureElement } from '../../utils/utils';
import { CDN_URL, settings } from '../../utils/constants';

export class Item extends Component<IItem> {
	protected element: HTMLElement;
	protected events: IEvents;
	protected itemButton?: HTMLButtonElement;
	protected itemCategory?: HTMLSpanElement;
	protected itemTitle: HTMLElement;
	protected itemImage?: HTMLImageElement;
	protected itemPrice?: HTMLSpanElement;
	protected itemId: string;
	protected itemDescription?: HTMLElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.itemCategory = this.container.querySelector(settings.cardCategory);
		this.itemTitle = ensureElement<HTMLElement>(settings.cardTitle, this.container);
		this.itemImage = this.container.querySelector(settings.cardImage);
		this.itemPrice = ensureElement<HTMLSpanElement>(
			settings.cardPrice,
			this.container
		);
		this.itemDescription =
			this.container.querySelector(settings.cardText) ?? undefined;
		this.itemButton = this.container.querySelector(settings.cardAddToBasketButton);

		this.container.addEventListener('click', () => {
			this.events.emit('item:select', { item: this });
		});
	}

	render(data?: Partial<IItem>): HTMLElement;

	render(itemData: Partial<IItem> | undefined) {
		if (!itemData) return this.container;
		return super.render(itemData);
	}

	set description(description: string) {
		if (this.itemDescription) {
			this.setText(this.itemDescription, description);
		}
	}

	public static setCategoryStyle(element: HTMLElement, category: string) {
		if (element) {
			element.className = settings.cardCategoryClass;
			switch (category) {
				case 'софт-скил':
					element.classList.add(settings.cardCategoryClassSoft);
					break;
				case 'хард-скил':
					element.classList.add(settings.cardCategoryClassHard);
					break;
				case 'другое':
					element.classList.add(settings.cardCategoryClassOther);
					break;
				case 'дополнительное':
					element.classList.add(settings.cardCategoryClassAdditional);
					break;
				case 'кнопка':
					element.classList.add(settings.cardCategoryClassButton);
					break;
				default:
					element.style.backgroundColor = 'blue';
					break;
			}
		}
	}

	set category(category: string) {
		Item.setCategoryStyle(this.itemCategory, category);
		this.setText(this.itemCategory, category);
	}

	set image(image: string) {
		if (this.itemImage) {
			this.itemImage.src = `${CDN_URL}/${image}`;
		}
	}

	set price(price: number | null) {
		if (this.itemPrice) {
			if (price === null) {
				this.setText(this.itemPrice, 'Бесценно');
			} else {
				this.setText(this.itemPrice, price.toString() + ' синапсов');
			}
		}
	}

	set title(title: string) {
		this.setText(this.itemTitle, title);
	}

	set id(id) {
		this.itemId = id;
	}
	get id() {
		return this.itemId;
	}
}
