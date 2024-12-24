import { Component } from './base/component';
import { ensureElement } from '../utils/utils';
import { IProduct, CategoryType } from '../types';
import { categoryMap } from '../utils/constants';

export interface ICardAction {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;
	

	constructor(container: HTMLElement, action?: ICardAction) {
		super(container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = container.querySelector('.card__button');

		if (action?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', action.onClick);
			} else {
				container.addEventListener('click', action.onClick);
			}
		}
	}

	set button(value: string) {
		if (this._button) {
			this._button.textContent = value;
		}
	}
	set id(value: string) {
		this.container.dataset.id = value;
	}

	set price(value: number) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		if (this._button) {
			this._button.disabled = !value;
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}
}

export class OnlyCardOnPage extends Card { //данный класс отвечает за отображение карточки на странице
    _image: HTMLImageElement;
    _category: HTMLElement;
    
    
    constructor(container: HTMLElement,  actions?: ICardAction) {
        super(container, actions);

        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);       
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }
    
    set category(value: CategoryType) {
        this.setText(this._category, value);
        this.toggleClass(this._category, categoryMap[value], true);
    }
}

export class CardPreview extends Card { //класс который отвечает за предпросмтр карточки с детальным ее описанием
    _description: HTMLElement;
   

    constructor(container: HTMLElement, actions?: ICardAction) {
        super(container, actions);
        this._description = ensureElement<HTMLElement>('.card__text', container);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

}

export class CardWithIndex extends Card {
    private _index: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardAction) {
        super(container, actions);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
    }

    set index(value: number) {
        this.setText(this._index, value.toString());
    }
}