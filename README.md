# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
---

## **Архитектура проекта**

Проект построен по **MVC-архитектуре (Model-View-Controller)**:

- **Model** управляет состоянием данных и бизнес-логикой.
- **View** отвечает за отображение интерфейса.
- **Controller** реализован через систему событий (EventEmitter), которая соединяет Model и View.

---

## **1. Model**

### **ItemData**

Хранит и предоставляет товары

**Поля:**

- `events`: `IEvents` — ссылка на брокер событий
- `_itemsResponse`: `{ total: number; items: IItem[] }` — список товаров с сервера
- `_preview`: `string | null` — ID предварительно выбранного товара

**Методы:**

- `get items()`: `IItem[]` — возвращает массив всех товаров
- `getItem(id: string)`: `IItem | undefined` — возвращает товар по ID
- `set itemsResponse(...)`: устанавливает данные и эмитит `items:changed`

---

### **BasketData**

Модель корзины — управляет товарами в заказе

**Поля:**

- `items`: `IItem[]` — товары в корзине
- `events`: `IEvents` — брокер событий

**Методы:**

- `addItem(item: IItem)`: добавляет товар
- `removeItem(id: string)`: удаляет товар
- `getItems()`: `IItem[]` — вернуть список товаров
- `getTotalItems()`: `number` — количество товаров
- `getTotalPrice()`: `number` — сумма товаров
- `clearBasket()`: очищает корзину
- `updateBasket()`: триггерит `basket:update`

---

### **UserData**

Хранит данные пользователя на всех шагах оформления заказа

**Поля:**

- `data`: `IUserData` — объект с email, телефоном, адресом, оплатой, id товаров, суммой

**Методы:**

- `updateData(newData: Partial<IUserData>)`: дополняет существующие данные
- `getData()`: `IUserData` — возвращает полные данные

---

### **ItemApi**

Работа с серверным API

**Поля:**

- `_baseApi`: `IApi` — базовая реализация API (с fetch)

**Методы:**

- `getItems()`: получает список всех товаров
- `setOrder(order: IUserData)`: отправляет заказ и возвращает `IOrderResult`

---

## **2. View**

### **Item**

Карточка товара

**Поля:**

- `itemTitle`: `HTMLElement` — заголовок
- `itemImage`: `HTMLImageElement` — картинка товара
- `itemCategory`: `HTMLSpanElement` — категория
- `itemDescription`: `HTMLElement` — описание
- `itemPrice`: `HTMLSpanElement` — цена
- `itemButton`: `HTMLButtonElement` — кнопка "в корзину"
- `itemId`: `string` — ID товара

**Методы:**

- `render(data)`: Устанавливает данные карточки. Если itemData отсутствует — возвращает DOM как есть
- `set image/price/title/category/description`: сеттеры для полей

---

### **HeaderView**

Карточка товара

**Поля:**

- `counterElement`: `HTMLElement` — элемент счётчика товаров
- `basketButton`: `HTMLButtonElement ` — кнопка открытия корзины

**Методы:**

- `setBasketCount()`: Обновляет отображение количества товаров в корзине.

---

### **Modal**

Базовый класс модального окна

**Поля:**

- `modal`: `HTMLElement` — корневой DOM-элемент окна
- `events`: `IEvents` — брокер событий, передаётся в конструктор
- `content`: `T | Null` — данные, переданные в render()

**Методы:**

- `open(): void`: Добавляет активный класс, а также навешивает слушатель на клавишу Escape.
- `close(): void`: Удаляет активный класс и снимает обработчик клавиши Escape. Сбрасывает content
- `handleEscUp(evt: KeyboardEvent): void`: Обработчик, вызывающий close(), если нажата клавиша Escape
- `render(data?: Partial<T>): HTMLElement`: Наследуется от Component, обновляет this данными и возвращает DOM-элемент модалки

---

### **ItemPreview**

Модальное окно предпросмотра товара

**Поля:**

- `addButton`: `HTMLButtonElement` — кнопка "в корзину"
- `itemCategory`: `HTMLSpanElement` — категория
- `itemTitle`: `HTMLElement` — название
- `itemImage`: `HTMLImageElement` — изображение
- `itemPrice`: `HTMLSpanElement` — цена
- `itemDescription`: `HTMLElement` — описание
- `currentItem`: `IItem | null` — выбранный товар

**Методы:**

- `set itemData(item)`: Заполняет данные предпросмотра и вызывает events.emit('item:check-button')
- `setButtonState(isInBasket, price)`: Обновляет текст и доступность кнопки: "В корзине" если уже добавлено. "Невозможно добавить", если нет цены. "В корзину" — по умолчанию.

---

### **Basket**

Модальное окно с корзиной

**Поля:**

- `basketList`: `HTMLUListElement` — список товаров
- `basketTotalPrice`: `HTMLElement` — сумма заказа
- `checkoutButton`: `HTMLButtonElement` — кнопка оформления

**Методы:**

- `render(data)`: Очищает текущий список и отрисовывает заново каждый товар. Если корзина пуста — блокирует кнопку "оформить". Навешивает событие на подтверждение заказа

---

### **OrderForm**

Форма выбора оплаты

**Поля:**

- `paymentButtons`: `HTMLButtonElement[]` — кнопки выбора оплаты

**Методы:**

- `validateForm()`: Проверяет, заполнены ли все поля + выбран ли способ оплаты. Отображает ошибку, если нет
- `handlePaymentMethodSelect(event: MouseEvent)`: Делает кнопку выбранной (formActiveButtonClass), эмитит order:payment-method-selected, запускает валидацию
- `set valid(isValid: boolean)`: Делегирует установку состояния submitButton родителю Form

---

### **Form**

Базовая форма

**Поля:**

- `inputs`: `HTMLInputElement[]` — инпуты формы
- `_form`: `HTMLFormElement` — DOM-форма
- `submitButton`: `HTMLButtonElement` — кнопка отправки
- `errorSpan`: `HTMLElement` — контейнер ошибок
- `formName`: `string` — имя формы

**Методы:**

- `validateForm()`: Проверяет, заполнены ли все поля. Отображает ошибку, если нет
- `showInputError()`/`hideInputError()`: Показывает/скрывает ошибку валидации
- `getInputValues()`: возвращает объект { name: value }



---

### **Success**

Модальное окно успешного заказа

**Поля:**

- `basketTotal`: `HTMLElement` — сумма заказа
- `sucessButton`: `HTMLButtonElement` — кнопка закрытия

**Методы:**

- `render(data: { total })`: Отображает сумму заказа (Списано {total} синапсов), эмитит success:submit

---

### **ItemContainer**

Контейнер для рендера карточек товаров

**Поля:**

- `_catalog`: `HTMLElement` — DOM контейнер

**Методы:**

- `set catalog(items)`: Полностью перерисовывает список карточек

---

## **3. Controller (Events)**

Реализация через `EventEmitter`.

### **EventEmitter**

**Поля:**

- `_events`: `Map<string | RegExp, Set<Function>>` — таблица подписчиков

**Методы:**

- `on(event, cb)`: подписка
- `emit(event, data?)`: генерация события
- `off(event, cb)`: отписка
- `trigger(event, context?)`: коллбэк-обёртка

---

## **События**

| Событие                      | Описание                                      |
|-----------------------------|-----------------------------------------------|
| `initialData:loaded`        | После загрузки товаров с сервера              |
| `basket:update`             | При изменении корзины                         |
| `item:select`               | Открытие карточки товара                      |
| `item:check-button`         | Проверка состояния кнопки "в корзину"         |
| `basket:add-item`           | Добавление товара в корзину                   |
| `basket:remove-item`        | Удаление товара из корзины                    |
| `basket:order`              | Нажатие "оформить"                            |
| `order:payment-method-selected` | Выбор способа оплаты                     |
| `order:submit`              | Отправка адреса доставки                      |
| `contact:submit`            | Отправка email и телефона                     |
| `success:submit`            | Успешное завершение заказа                    |

---

## **Валидация**

Происходит внутри `Form` и `OrderForm`:

- Поля не должны быть пустыми.
- При ошибке отображается сообщение в `errorSpan`.
- `OrderForm` требует выбранного способа оплаты.
- Кнопка отправки блокируется при `!valid`.

---
