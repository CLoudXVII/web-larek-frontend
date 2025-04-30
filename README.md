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

- `render(data)`: рендер карточки
- `set image/price/title/category/description`: сеттеры для полей

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

- `set itemData(item)`: устанавливает данные
- `setButtonState(isInBasket, price)`: меняет текст и состояние кнопки

---

### **Basket**

Модальное окно с корзиной

**Поля:**

- `basketList`: `HTMLUListElement` — список товаров
- `basketTotalPrice`: `HTMLElement` — сумма заказа
- `checkoutButton`: `HTMLButtonElement` — кнопка оформления

**Методы:**

- `render(data)`: отрисовка всех товаров в корзине
- `createBasketItemElement(...)`: создает DOM элемент товара

---

### **OrderForm**

Форма выбора оплаты

**Поля:**

- `paymentButtons`: `HTMLButtonElement[]` — кнопки выбора оплаты

**Методы:**

- `validateForm()`: валидация заполненности и выбора метода оплаты

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

- `validateForm()`, `showInputError()`, `hideInputError()`
- `getInputValues()`: `Record<string, string>`

---

### **Success**

Модальное окно успешного заказа

**Поля:**

- `basketTotal`: `HTMLElement` — сумма заказа
- `sucessButton`: `HTMLButtonElement` — кнопка закрытия

**Методы:**

- `render(data: { total })`: рендер финального экрана

---

### **ItemContainer**

Контейнер для рендера карточек товаров

**Поля:**

- `_catalog`: `HTMLElement` — DOM контейнер

**Методы:**

- `set catalog(items)`: перерисовывает список товаров

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
