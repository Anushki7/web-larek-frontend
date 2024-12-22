import { IProduct, IOrderResponse } from '../types';
import { Api, ApiListResponse } from './base/api';

export class ApiNew extends Api {
    readonly cdn: string;
    constructor( baseUrl: string, cdn: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProductsItem() {
        return this.get('/product')
        .then((data: ApiListResponse<IProduct>) => {
            return data.items.map((item) => ({ ...item }))
        })
        .catch((err) => {
            console.error(err); 
        });
    }

    orderProductsResponse(order: IOrderResponse) {
        return this.post('/order', order).then((data: IOrderResponse) => data);
    }

}