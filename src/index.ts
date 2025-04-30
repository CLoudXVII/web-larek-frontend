import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/api';
import { ProductAPI } from './components/model/api';
import { AppStateEmitter } from './components/model/appStateEmitter';

import { MainScreen } from './components/view/screen/main';
import { CardView } from './components/view/partial/card';

import { Product } from './types/components/model/api';
import { AppStateChanges } from './types/components/model/appState';
import { AppStateEvents } from './types/components/model/appStateEmitter';

// 1. Инициализация API-клиента и брокера состояния
const api = new ProductAPI(new Api(API_URL));
const state = new AppStateEmitter(api);

// 2. Инициализация UI (MainScreen)
const root = document.querySelector('.page') as HTMLElement;
const main = new MainScreen(root, {
	onOpenCart: () => console.log('Открыть корзину'),
	renderItems: () => {} // не используется напрямую — заменяется событием
});

// 3. Генерация карточки
function createCard(product: Product): HTMLElement {
	return new CardView('#card-catalog', {
		title: product.title,
		category: product.category,
		price: product.price ? `${product.price} синапсов` : 'Бесценно',
		image: `${CDN_URL}${product.image}`,
		compactClass: 'card_compact',
		isCompact: false,
		onClick: () => {
			state.model.addToCart(product);
		},
		onOpenCard: (id) => {
			console.log(`Открыть карточку ${id}`);
		}
	}).render(product);
}

// 4. Подписка на события изменения каталога
state.on(AppStateChanges.products, (products: Product[]) => {
	const fragment = document.createDocumentFragment();
	products.map(createCard).forEach(card => fragment.append(card));

	main.render({
		counter: state.model.cart.length,
		cartContent: fragment as unknown as HTMLElement
	});
});

// 5. Подписка на изменения корзины (обновление счётчика)
state.on(AppStateChanges.cart, ({ total, products }) => {
	main.updateCounter(products.length);
});

// 6. Загрузка каталога
state.model.loadProducts();
