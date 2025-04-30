import { Item } from './Item';
import { IItem } from '../../types';
import { Modal } from '.././common/Modal';
import { IEvents } from '.././base/Events';
import { ensureElement } from '../../utils/utils';
import { CDN_URL, settings } from '../../utils/constants';

export interface IItemPreview {
	addButton: HTMLButtonElement;
	item: IItem;
}

export class ItemPreview extends Modal<IItemPreview> {
	private addButton: HTMLButtonElement;
	private itemCategory: HTMLSpanElement;
	private itemTitle: HTMLElement;
	private itemImage: HTMLImageElement;
	private itemPrice: HTMLSpanElement;
	private itemDescription: HTMLElement;
	private currentItem: IItem | null = null;
	private handleAddButtonClick: () => void;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.events = events;

		this.addButton = ensureElement<HTMLButtonElement>(
			settings.button,
			this.container
		);
		this.itemCategory = ensureElement<HTMLSpanElement>(
			settings.cardCategory,
			this.container
		);
		this.itemTitle = ensureElement<HTMLElement>(settings.cardTitle, this.container);
		this.itemImage = ensureElement<HTMLImageElement>(
			settings.cardImage,
			this.container
		);
		this.itemPrice = ensureElement<HTMLSpanElement>(
			settings.cardPrice,
			this.container
		);
		this.itemDescription =
			ensureElement<HTMLElement>(settings.cardText, this.container) ?? undefined;

		this.handleAddButtonClick = () => {
			if (this.currentItem) {
				events.emit('basket:add-item', this.currentItem);
				this.updateButtonState();
				this.close();
			}
		};

		if (this.addButton) {
			this.addButton.addEventListener('click', this.handleAddButtonClick);
		}
	}

	set itemData(item: IItem) {
		this.currentItem = item;
		this.updateButtonState();

		if (this.itemCategory) {
			Item.setCategoryStyle(this.itemCategory, item.category);
			this.setText(this.itemCategory, item.category);
		}

		if (this.itemTitle) {
			this.setText(this.itemTitle, item.title);
		}
		if (this.itemImage) {
			this.itemImage.src = `${CDN_URL}/${item.image}`;
		}
		if (this.itemPrice) {
			this.setText(
				this.itemPrice,
				item.price !== null ? `${item.price} синапсов` : 'Бесценно'
			);
		}

		if (this.itemDescription) {
			this.setText(this.itemDescription, item.description ?? '');
		}

		super.open();
	}

	private updateButtonState() {
		if (this.currentItem) {
			this.events.emit('item:check-button', { id: this.currentItem.id });
		}
	}

	public setButtonState(isInBasket: boolean, price: number | null) {
		if (isInBasket) {
			// Если товар уже в корзине
			this.addButton.disabled = true;
			this.setText(this.addButton, 'В корзине');
		} else if (price === null) {
			// Если цена товара равна null
			this.addButton.disabled = true;
			this.setText(this.addButton, 'Невозможно добавить');
		} else {
			// Если товар не в корзине и цена известна
			this.addButton.disabled = false;
			this.setText(this.addButton, 'В корзину');
		}
	}
}
