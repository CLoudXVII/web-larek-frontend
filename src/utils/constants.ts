export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
	button: '.button',

	cardContainer: '.gallery',
	cardTemplate: '#card-catalog',
	cardCategory: '.card__category',
	cardTitle: '.card__title',
	cardImage: '.card__image',
	cardPrice: '.card__price',
	cardText: '.card__text',
	cardAddToBasketButton: '.card-add-button',

	cardCategoryClass: 'card__category',
	cardCategoryClassSoft: 'card__category_soft',
	cardCategoryClassHard: 'card__category_hard',
	cardCategoryClassOther: 'card__category_other',
	cardCategoryClassAdditional: 'card__category_additional',
	cardCategoryClassButton: 'card__category_button',
	

	modalInfo: '#info-modal',
	modalBasket: '#basket-modal',
	modalSuccess: '.success-modal',
	modalOrder: '#order-modal',
	modalContacts: '#contact-modal',
	modalCloseButton: '.modal__close',
	
	modalActiveClass: 'modal_active',
	
	basketTemplate: '#card-basket',
	basketList: '.basket__list',
	basketItemIndex: '.basket__item-index',
	basketItemDelete: '.basket__item-delete',
	basketConfirmButton: '.basket-confirm-button',
	basketOpenButton: '.header__basket',
	basketCounter: '.header__basket-counter',
	basketTotalPrice: '.basket__price',

	form: '.form',
	formInput: '.form__input',
	formError: '.form__errors',
	formSubmit: '.button-submit',
	formOrderButton: '.order__buttons',

	formActiveButtonClass: 'button_alt-active',

	orderSuccessDesc: '.order-success__description',
	orderSuccessClose: '.order-success__close',

};
