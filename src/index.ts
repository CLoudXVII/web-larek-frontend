import './scss/styles.scss';
import { API_URL, settings } from './utils/constants';

import { ItemApi } from './components/model/ItemApi';
import { UserData } from './components/model/UserData';
import { ItemData } from './components/model/ItemData';
import { EventEmitter } from './components/base/Events';
import { BasketData } from './components/model/BasketData';

// Типы и базовые классы
import type { IItem } from './types';
import { Api } from './components/base/Api';

// Компоненты
import { Item } from './components/view/Item';
import { Form } from './components/common/Form';
import { Basket } from './components/view/Basket';
import { Success } from './components/view/Success';
import { OrderForm } from './components/view/OrderForm';
import { ItemPreview } from './components/view/ItemPreview';
import { ItemContainer } from './components/view/ItemContainer';

import { cloneTemplate, ensureElement } from './utils/utils';

// Инициализация
const events = new EventEmitter();
const api = new ItemApi(new Api(API_URL));

const itemsData = new ItemData(events);
const basketData = new BasketData(events);
const userData = new UserData();

// Шаблоны и DOM-элементы
const cardTemplate = ensureElement<HTMLTemplateElement>(settings.cardTemplate);
const basketCounter = ensureElement<HTMLElement>(settings.basketCounter);
const basketOpenButton = ensureElement<HTMLButtonElement>(settings.basketOpenButton);

// Модальные окна
const itemModal = new ItemPreview(
    ensureElement<HTMLElement>(settings.modalInfo),
    events
);
const basketModal = new Basket(
    ensureElement<HTMLElement>(settings.modalBasket),
    events
);
const successModal = new Success(
    ensureElement<HTMLElement>(settings.modalSuccess),
    events
);

// Формы
const orderForm = new OrderForm(
    ensureElement<HTMLElement>(settings.modalOrder),
    events
);
const contactForm = new Form(
    ensureElement<HTMLElement>(settings.modalContacts),
    events
);

// Контейнер для отображения товаров
const itemsContainer = new ItemContainer(
    ensureElement<HTMLElement>(settings.cardContainer)
);

// События 

// Открытие корзины
basketOpenButton.addEventListener('click', () => {
    basketModal.render({
        items: basketData.getItems(),
        totalPrice: basketData.getTotalPrice()
    });
    basketModal.open();
});

// Обновление счётчика в корзине
events.on('basket:update', () => {
    basketCounter.textContent = basketData.getTotalItems().toString();
});

// Загрузка данных
api.getItems().then((initialItems) => {
    itemsData.itemsResponse = initialItems;
    events.emit('initialData:loaded');
}).catch(console.error);

// Построение галереи при загрузке
events.on('initialData:loaded', () => {
    const renderedItems = itemsData.items.map((item) => {
        const itemComponent = new Item(cloneTemplate(cardTemplate), events);
        return itemComponent.render(item);
    });
    itemsContainer.render({ catalog: renderedItems });
});

// Открытие карточки товара
events.on('item:select', ({ item }: { item: Item }) => {
    const data = itemsData.getItem(item.id);
    if (data) {
        itemModal.render({ item: data });
        itemModal.itemData = data;
        events.emit('item:check-button', { id: data.id });
    }
});

// Добавление товара в корзину
events.on('basket:add-item', (item: IItem) => {
    basketData.addItem(item);
    events.emit('item:check-button', { id: item.id });
});

// Удаление товара из корзины
events.on('basket:remove-item', ({ id }: { id: string }) => {
    basketData.removeItem(id);
    events.emit('item:check-button', { id });
});

// Обновление состояния кнопки "в корзине"
events.on('item:check-button', ({ id }: { id: string }) => {
    const item = itemsData.getItem(id);
    if (item) {
        const isInBasket = basketData.isItemInBasket(id);
        itemModal.setButtonState(isInBasket, item.price);
    }
});

// Передача заказа
events.on('basket:order', ({ data }: { data: { items: IItem[]; totalPrice: number } }) => {
    userData.updateData({
        items: data.items.map((item) => item.id),
        total: data.totalPrice,
    });
    basketModal.close();
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

// Очистка корзины после успешного заказа
events.on('success:submit', () => {
    basketData.clearBasket();
});
