import {
	AppStateImpl
} from './appState';

import {
	AppState,
	AppStateModals,
	AppStateChanges
} from '../../types/components/model/appState';

import {
	AppStateEvents,
	ModelEmitter,
	ModalChange
} from '../../types/components/model/appStateEmitter';

import { Contacts } from '../../types/components/model/api';
import { IProductAPI } from '../../types/components/model/api';
import { EventEmitter } from '../base/eventEmitter';

export class AppStateEmitter extends EventEmitter<AppStateEvents> implements ModelEmitter<AppState, AppStateEvents> {
	public model: AppState;
	private previousModal: AppStateModals = AppStateModals.none;

	constructor(api: IProductAPI) {
		super();
		this.model = new AppStateImpl(api, {
			onChange: (change) => this.handleChange(change)
		});
	}

	private handleChange(change: AppStateChanges): void {
		switch (change) {
			case AppStateChanges.products:
				this.emit(AppStateChanges.products, Array.from(this.model.products.values()));
				break;

			case AppStateChanges.cart:
				this.emit(AppStateChanges.cart, {
					total: this.model.cartTotal,
					products: this.model.getCartItems()
				});
				break;

			case AppStateChanges.modal:
				const current = this.model.openedModal;
				const previous = this.previousModal;
				this.previousModal = current;
				this.emit(AppStateChanges.modal, { previous, current } satisfies ModalChange);
				break;

			case AppStateChanges.modalMessage:
				this.emit(AppStateChanges.modalMessage, {
					message: 'Неизвестная ошибка',
					isError: true
				});
				break;

			case AppStateChanges.selectedProduct:
				const last = this.model.cart.at(-1) ?? null;
				this.emit(AppStateChanges.selectedProduct, last);
				break;

			case AppStateChanges.order:
				this.emit(AppStateChanges.order, this.model.contacts as Contacts);
				break;

			default:
				break;
		}
	}
}
