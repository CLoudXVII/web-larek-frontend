import { View } from '../../base/view';
import { MainData, MainSettings } from '../../../types/components/view/screen/main';

export class MainScreen extends View<MainData<HTMLElement>, MainSettings> {
	private counterElement: HTMLElement;
	private cartButton: HTMLElement;
	private cartContainer: HTMLElement;

	constructor(template: string | HTMLTemplateElement | HTMLElement, settings: MainSettings) {
		super(template, settings);

		this.counterElement = this.element.querySelector('.header__basket-counter')!;
		this.cartButton = this.element.querySelector('.header__basket')!;
		this.cartContainer = this.element.querySelector('.gallery')!;

		this.cartButton.addEventListener('click', () => {
			this.settings.onOpenCart();
		});
	}

	public updateCounter(count: number): void {
		this.counterElement.textContent = String(count);
	}

	render(data?: Partial<MainData<HTMLElement>>): HTMLElement {
		if (data?.counter !== undefined) {
			this.counterElement.textContent = String(data.counter);
		}
		if (data?.cartContent) {
			this.cartContainer.replaceChildren(data.cartContent);
		}
		return this.element;
	}
}
