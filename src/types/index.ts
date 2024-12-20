interface IProduct {
    id: string;
    category: string;
    title: string;
    description: string;
    image: string;
    price: number | null;
}

interface IUser { //данные о пользователе
    payment?: string;
    address?: string;
    email?: string;
    phone?: string;
    total?: string | number; // общая стоимость заказа
}

interface IProductData {
    items: IProduct[];
    total: number;   // общее кол-во карточек
}

interface IOrderData {
	list: HTMLElement[]; // Массив карточек в корзине
	total: number; // Общая стоимость заказа
}