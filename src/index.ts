import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/api';
import { ProductAPI } from './components/model/api';
import { AppStateEmitter } from './components/model/appStateEmitter';

import { MainScreen } from './components/view/screen/main';
import { CardView } from './components/view/partial/card';

import { Product } from './types/components/model/api';

// 1. Инициализация API
const api = new ProductAPI(new Api(API_URL));

// 2. Состояние с событиями
const state = new AppStateEmitter(api);

// 3. Создание карточки товара
function createCard(product: Product): HTMLElement {
	const card = new CardView('#card-catalog', {
		title: product.title,
		category: product.category,
		price: product.price ? `${product.price} синапсов` : 'Бесценно',
		image: `${CDN_URL}${product.image}`,
		compactClass: 'card_compact',
		isCompact: false,
		onClick: () => {
			state.model.addToCart(product);
			main.updateCounter(state.model.cart.length);
		},
		onOpenCard: (id: string) => {
			console.log(`Открыть карточку с id=${id}`);
		}
	});
	return card.render(product);
}


// 4. Получение DOM-элемента и MainScreen
const root: HTMLElement = document.querySelector('.page')!;
const main = new MainScreen(root, {
	onOpenCart: () => console.log('Открыть корзину'),
	renderItems: () => {
		const catalog = Array.from(state.model.products.values());
		const cards = catalog.map(createCard);
	
		const fragment = document.createDocumentFragment();
		cards.forEach(card => fragment.append(card));
	
		main.render({
			counter: state.model.cart.length,
			cartContent: fragment as unknown as HTMLElement // ⚠ типовой workaround
		});
	}	
});

// 5. Публичный метод обновления счётчика
main.updateCounter = function (count: number) {
	this.counterElement.textContent = String(count);
};

// 6. Подписка на обновление каталога
state.on('change:products', () => {
	main['settings'].renderItems();
});

// 7. Запуск загрузки товаров
console.log('[DEBUG] вызов loadProducts()');
state.model.loadProducts();


