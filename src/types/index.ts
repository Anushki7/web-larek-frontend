export type PaymentMethod = 'cash' | 'online' | null; //тип определения способа оплаты

export type CategoryType =  //  тип категории товаров
	| 'другое'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export type CategoryMap = {
        [Key in CategoryType]: string;
};


export interface IProduct { //Данные о товаре
    id: string;
    category: string;
    title: string;
    description: string;
    image: string;
    price: number | null;
    button?: string; // Кнопка "Купить" (карточки)
    index?: number;
}

export interface IProductData { //для хранения товаров в каталоге
    items: IProduct[]; // массив карточек
    total: number;   // общее кол-во карточек
}

export interface IUser { //данные о пользователе
    payment?: string;
    address?: string;
    email?: string;
    phone?: string;
    total?: string | number; // общая стоимость заказа
}

export interface IOrderData {
	list: HTMLElement[]; // Массив карточек в корзине
	total: number; // Общая стоимость заказа
}

export interface IOrderResponse extends IUser { // Данные о заказе
	items: string[]; // Идентификатор заказа
}

export type FormErrors = Partial<Record<keyof IUser, string>>; // Тип, по которому будет определяться, какую ошибку вывести в конкретную форму

export interface IForm { // Интерфейс для валидации форм
	valid: boolean; // Состояние валидации формы
	errors: string[]; // Сообщения об ошибках валидации
}