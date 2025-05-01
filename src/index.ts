import './scss/styles.scss';
import { API_URL, settings } from './utils/constants';

import { ItemApi } from './components/model/ItemApi';
import { UserData } from './components/model/UserData';
import { ItemData } from './components/model/ItemData';
import { EventEmitter } from './components/base/Events';
import { BasketData } from './components/model/BasketData';

import type { IItem } from './types';
import { Api } from './components/base/Api';

import { Item } from './components/view/Item';
import { Form } from './components/common/Form';
import { Basket } from './components/view/Basket';
import { Success } from './components/view/Success';
import { OrderForm } from './components/view/OrderForm';
import { ItemPreview } from './components/view/ItemPreview';
import { ItemContainer } from './components/view/ItemContainer';
import { HeaderView } from './components/view/Header';

import { cloneTemplate, ensureElement } from './utils/utils';

// Инициализация
const events = new EventEmitter();
const api = new ItemApi(new Api(API_URL));

const itemsData = new ItemData(events);
const basketData = new BasketData(events);
const userData = new UserData();

// Представления
const headerView = new HeaderView(ensureElement<HTMLElement>(settings.header), events);
const itemsContainer = new ItemContainer(ensureElement<HTMLElement>(settings.cardContainer));

const itemModal = new ItemPreview(ensureElement<HTMLElement>(settings.modalInfo), events);
const basketModal = new Basket(ensureElement<HTMLElement>(settings.modalBasket), events);
const successModal = new Success(ensureElement<HTMLElement>(settings.modalSuccess), events);

const orderForm = new OrderForm(ensureElement<HTMLElement>(settings.modalOrder), events);
const contactForm = new Form(ensureElement<HTMLElement>(settings.modalContacts), events);

function updateBasketUI() {
	headerView.setBasketCount(basketData.getTotalItems());

	if (basketModal.isOpen) {
		basketModal.render(basketData.getItems());
	}
}

function updateItemButtonState(id: string) {
	const item = itemsData.getItem(id);
	if (item) {
		const isInBasket = basketData.isItemInBasket(id);
		itemModal.setButtonState(isInBasket, item.price);
	}
}

api.getItems()
	.then((initialItems) => {
		itemsData.itemsResponse = initialItems;
		const renderedItems = itemsData.items.map((item) => {
			const itemComponent = new Item(cloneTemplate(settings.cardTemplate), events);
			return itemComponent.render(item);
		});
		itemsContainer.render({ catalog: renderedItems });
	})
	.catch(console.error);

// Слушатели событий

events.on('basket:open', () => {
	basketModal.render(basketData.getItems());
	basketModal.open();
});

events.on('basket:update', updateBasketUI);

// Открытие карточки товара
events.on('item:select', ({ item }: { item: Item }) => {
	const data = itemsData.getItem(item.id);
	if (data) {
		itemModal.render({ item: data });
		itemModal.itemData = data;
		updateItemButtonState(data.id);
	}
});

// Добавление в корзину
events.on('basket:add-item', (item: IItem) => {
	basketData.addItem(item);
	updateItemButtonState(item.id);
});

// Удаление из корзины
events.on('basket:remove-item', ({ id }: { id: string }) => {
	basketData.removeItem(id);
	updateItemButtonState(id);
});

// Передача заказа
events.on('basket:order', () => {
	const items = basketData.getItems();

	userData.updateData({
		items: items.map((item) => item.id),
		total: basketData.getTotalPrice()
	});

	basketModal.close();
	orderForm.setFormData(userData.getData());
	orderForm.open();
});


// Выбор способа оплаты
events.on('order:payment-method-selected', ({ method }: { method: string }) => {
	const payment = method === 'card' ? 'online' : 'offline';
	userData.updateData({ payment });
});

// Отправка формы доставки
events.on('order:submit', ({ address }: { address: string }) => {
	userData.updateData({ address });
	orderForm.close();

	const user = userData.getData();
	const contactData = {
		email: user.email || '',
		phone: user.phone || '',
	};

	contactForm.setFormData(contactData);
	contactForm.open();
});

// Отправка контактных данных
events.on('contact:submit', ({ email, phone }: { email: string; phone: string }) => {
	userData.updateData({ email, phone });
	contactForm.close();

	api.setOrder(userData.getData())
		.then(({ total }) => {
			successModal.render({ total });
			successModal.open();
		})
		.catch(console.error);
});

// Очистка корзины после заказа
events.on('success:submit', () => {
	basketData.clearBasket();
	updateBasketUI();
});
