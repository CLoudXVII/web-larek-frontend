import { AppStateChanges, AppStateModals } from './appState';
import { Emitter } from '../base/eventEmitter';
import { Contacts, Product } from './api';

// Для корректной обработки событий открытия и закрытия модальных окон
// нам нужно знать предыдущее и текущее состояние.
export type ModalChange = {
	previous: AppStateModals;
	current: AppStateModals;
};

export interface ModelEmitter<T, E> extends Emitter<E> {
	model: T;
}

export interface AppStateEvents {
	[AppStateChanges.modal]: ModalChange;
	[AppStateChanges.cart]: {
		total: number;
		products: Product[];
	};
	[AppStateChanges.products]: Product[];
	[AppStateChanges.selectedProduct]: Product | null;
	[AppStateChanges.order]: Contacts;
	[AppStateChanges.modalMessage]: {
		message: string;
		isError: boolean;
	};

	[AppStateModals.productPreview]: never;
	[AppStateModals.cart]: never;
	[AppStateModals.paymentMethod]: never;
	[AppStateModals.contactInfo]: never;
	[AppStateModals.success]: never;
	[AppStateModals.none]: never;

	[key: string]: unknown;
}
