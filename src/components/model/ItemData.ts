import { IEvents } from '.././base/Events';
import { IItem, IItemData } from '../../types';

export class ItemData implements IItemData {
	protected _itemsResponse: { total: number; items: IItem[] };
	protected _preview: string | null;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set itemsResponse(response: { total: number; items: IItem[] }) {
		this._itemsResponse = response;
		this.events.emit('items:changed');
	}

	get items(): IItem[] {
		return this._itemsResponse.items;
	}

	getItem(itemId: string) {
		return this.items.find((item) => item.id === itemId);
	}

	get preview() {
		return this._preview;
	}
}
