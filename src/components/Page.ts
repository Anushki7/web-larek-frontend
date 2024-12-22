import {IEvents} from "./base/events";
import { ensureElement } from '../utils/utils';
import {Component} from "./base/component";

interface IPage { //Интерфейс, описывающий структуру страницы
    catalog: HTMLElement[];
}

export class Page extends Component<IPage> {
    protected _hdrBasketCounter: HTMLElement;
	protected _gallery: HTMLElement;
	protected _pageWrapper: HTMLElement;
	protected _hdrBasket: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container); 
    
        // Инициализация элементов страницы с помощью функции ensureElement
        this._hdrBasketCounter = ensureElement<HTMLElement>('.header__basket-counter'); 
        this._gallery = ensureElement<HTMLElement>('.gallery'); 
        this._pageWrapper = ensureElement<HTMLElement>('.page__wrapper'); 
        this._hdrBasket = ensureElement<HTMLElement>('.header__basket'); 
    
        // Добавление обработчика события клика на элемент корзины
        this._hdrBasket.addEventListener('click', () => {
          this.events.emit('basket:open'); // Эмиссия события открытия корзины
        });
    }

    // Установить значение счетчика
    set counter(value: number) {
        this.setText(this._hdrBasketCounter, String(value)); // Обновление текста элемента счетчика
    }

    // установить содержимое каталога
    set catalog(items: HTMLElement[]) {
		this._gallery.replaceChildren(...items); // Замена содержимого каталога новыми элементами
	}

    // Установить состояние заблокированной страницы
    set locked(value: boolean) {
        if (value) {
            this._pageWrapper.classList.add('page__wrapper_locked');
        } else {
            this._pageWrapper.classList.remove('page__wrapper_locked');
        }
    }
}