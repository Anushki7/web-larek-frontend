import { Model } from './base/model';
import {IProduct, IUser, FormErrors } from '../types/index';
import { IEvents } from './base/events';

export class ModelProducts extends Model<IProduct> {
    items: IProduct[] = []; 
	preview: string; 
	basket: IProduct[] = []; 
	userData: IUser = {}; 
	formErrors: FormErrors = {}; 

    constructor(data: Partial<IProduct>, events: IEvents) {
		super(data, events);
		this.userData = {
			payment: '',
			address: '',
			email: '',
			phone: ''
		};
	}

	addProducts(cards: IProduct[]) { //метод добавления массива с товарами в модель
		this.items = cards;
		this.events.emit('items:changed');
	}

	getProducts(): IProduct[] { //метод получения массива с товарами
		return this.items;
	}

	getUserInfo() { //метод для получения данных о пользователе
		return this.userData;
	}

	setPreview(card: IProduct) { //метод предпросмотра карточки товара при клике на нее
		this.preview = card.id;
		this.events.emit('preview:change', card);
	}

	addToBasket(id: string): void { //метод добавления в корзину
		this.basket.push(this.getIdCard(id));
		this.events.emit('basket:change', this.basket);
	}
	
	isProductsInBasket(id: string): boolean { //метод провекри наличия товара в корзине
		return this.basket.some((item) => item.id === id);
	}

	deleteFromBasket(id: string) { //метод удаления товара из корзины
		this.basket = this.basket.filter((item) => item.id !== id);
		this.events.emit('basket:change', this.basket);
	}

	clearBasket() { //метод очистки корзины
		this.basket = [];
        this.events.emit('basket:change', this.basket);
	}

	getCountsInBasket() { //метод получения количества товаров в корзине
		return this.basket.length;
	}

	getIdProductsInBasket() { //метод получения списка ID товаров в корзине
		return this.basket.map((item) => item.id);
	}

	getIdCard(id: string): IProduct { //метод получения карточки по ID
		return this.items.find((item) => item.id === id);
	}


	getAllPrice() { //метод получения общей стоимости товаров в корзине
		return this.basket.reduce((acc, item) => acc + item.price, 0);
	}

	fillUsercontacts(field: keyof IUser, value: string): void { //метод для заполнения полей с контактными данными пользователя
		this.userData[field] = value;
		if (this.validateContact()) {
			this.events.emit('order:ready', this.userData);
		} 
	}
	
	getFormErrors() { //метод получения ошибок формы
		return this.formErrors;
	}
	
	getFieldPayment() { //метод получения полей c выбором тпа оплаты
		return this.userData.payment;
	}

	getBasket(): IProduct[] { //возвращает массив товаров в корзине
		return this.basket;
	}

    //метод валидации формы с полями ввода addreess, email, phone
	validateContact(): boolean {
		const errors: typeof this.formErrors = {};
		//Если не указан адрес или способ оплаты, то в объект errors добавляются соответствующие сообщения об ошибке
		if (!this.userData.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.userData.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		if (!this.userData.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.userData.phone) {
			errors.phone = 'Необходимо указать номер телефона';
		}
		this.formErrors = errors;
		this.events.emit('input:error', this.formErrors);
		//Функция возвращает true, если ошибок нет (длина массива ключей ошибок равна 0), и false в противном случае.
		return Object.keys(errors).length === 0;
	}

	//метод очистки корзины после заказа
	clearUser() {
		this.userData = {
			payment: '',
			address: '',
			email: '',
			phone: '',
		};
		this.formErrors = {};
		this.events.emit('input:error', this.formErrors);
	}
}
