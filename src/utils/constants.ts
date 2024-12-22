import { CategoryMap } from "../types";

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`; //используется для запросов данных о товарах и отправки заказа
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`; //используется для формирования адреса картинки в товаре.

export const settings = {

};

export const categoryMap: CategoryMap  = {
    'другое': 'card__category_other',
    'софт-скил': 'card__category_soft',
    'дополнительное': 'card__category_additional',
    'кнопка': 'card__category_button',
    'хард-скил': 'card__category_hard',
};