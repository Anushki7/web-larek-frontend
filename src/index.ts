import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { CategoryType, IProduct, IUser, IOrderResponse } from './types/index';
import { Page } from './components/Page';
import { ApiNew } from './components/Api';
import { ModelProducts } from './components/Model';
import { OnlyCardOnPage, CardPreview, CardWithIndex } from './components/Card';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success, ISuccess } from './components/Success';

// Все шаблоны
const catalogProductTemplate = ensureElement<HTMLTemplateElement>('#card-catalog'); //Каталог карточек
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview'); //Предпросмотр продукта
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket'); //Модальное окно корзины
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket'); //Элементы корзины
const orderTemplate = ensureElement<HTMLTemplateElement>('#order'); //Модальное окно заказа
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts'); // Модальное окно контактов
const successTemplate = ensureElement<HTMLTemplateElement>('#success'); //Модальное окно успешного заказа

const api = new ApiNew(API_URL, CDN_URL); 
const events = new EventEmitter(); // события 
const model = new ModelProducts({},events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate<HTMLFormElement>(orderTemplate), events);
const contacts = new Contacts(cloneTemplate<HTMLFormElement>(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
	},
});
 

// Получение списка карточек
api
	.getProductsItem()
	.then(model.addProducts.bind(model))
	.catch((err) => {
		console.log(err);
	});

events.on('items:changed', () => { // Вывод списка карточек в каталоге
	page.catalog = model.getProducts().map((item) => {
		const card = new OnlyCardOnPage(cloneTemplate(catalogProductTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			category: item.category as CategoryType,
			image: api.cdn + item.image,
			price: item.price,
		});
	});
});

events.on('card:select', (item: IProduct) => { // клик пользователя по карте
	model.setPreview(item); 
});

events.on('preview:change', (item: IProduct) => { // отображение предпросмотра карточки
	const productInBasket = model.isProductsInBasket(item.id);
	const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (productInBasket) {
				events.emit('basket:delete', item);
			} else {
				events.emit('card:toBasket', item);
			}
			modal.close();
		},
	});

	modal.render({
		content: cardPreview.render({
			id: item.id,
			title: item.title,
			price: item.price,
			category: item.category as CategoryType,
			image: api.cdn + item.image,
			description: item.description,
			button: productInBasket ? 'Удалить из корзины' : 'В корзину',
		}),
	});
});

events.on('modal:open', () => { // Блокируем прокрутку страницы если открыта модалка
	page.locked = true;
});

events.on('modal:close', () => { // ... и разблокируем
	page.locked = false;
});

events.on('basket:open', () => { // открываем корзину
	modal.render({
		content: basket.render({}),
	});
});

events.on('basket:change', () => { // изменение корзины
	page.counter = model.getCountsInBasket();
	basket.total = model.getAllPrice();
	basket.list = model.getBasket().map((item, index) => {
		const cardBasket = new CardWithIndex(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('basket:delete', item),
		});
		
		return cardBasket.render({
			price: item.price,
			title: item.title,
			index: index + 1,
		});
	});
});

events.on('card:toBasket', (item: IProduct) => { // добавляем товар в корзину
	model.addToBasket(item.id);
});

events.on('basket:delete', (item: IProduct) => { //удаляем товар из корзины
	model.deleteFromBasket(item.id);
});

events.on('basket:toOrder', () => { // начало формления заказа (событие нажатия на кнопку "оформить")
	model.clearUser();
	modal.render({
		content: order.render({
			valid: false,
			errors: [],
			address: '',
			payment: null,
		}),
	});
});

events.on('input:error', (errors: Partial<IUser>) => { // Изменение данных
	const { payment, address, email, phone } = errors;
	order.valid = !payment && !address;
	contacts.valid = !email && !phone;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
	order.payment = model.getFieldPayment();
});

events.on( // событие изменения полей
	'orderInput:change',
	(data: { field: keyof IUser; value: string }) => {
		model.fillUsercontacts(data.field, data.value);
	}
);

events.on('order:submit', () => { // событие отправки формы
	modal.render({
		content: contacts.render({
			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => { // отправляем контактные данные
	const orderData = model.getUserInfo();
	orderData.total = model.getAllPrice();

	const items = model.getIdProductsInBasket();
	
	const payload: IOrderResponse = { // Формируем payload для отправки
		payment: orderData.payment,
		address: orderData.address,
		email: orderData.email,
		phone: orderData.phone,
		total: orderData.total,
		items: items,
	};

	api
		.orderProductsResponse(payload)
		.then((result) => {
			events.emit('order:success', result);
			model.clearBasket();
		})
		.catch((error) => {
			console.error(error);
		});
});

events.on('order:success', (result: ISuccess) => { // событие успешного оформления заказа
	modal.render({
		content: success.render({
			total: result.total,
		}),
	});
	model.clearBasket();
});

events.on('input:validate', (data: { field: keyof IUser; value: string }) => { // событие запуска валидации
	model.fillUsercontacts(data.field, data.value);
});