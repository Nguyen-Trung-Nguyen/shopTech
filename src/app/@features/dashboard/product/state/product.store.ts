import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface ProductState {
	error: HttpErrorResponse;
	products: any;
	productDetail: any;
	searchResult: any;
	loading: boolean;
	filterOption: any;
}
const initialState: ProductState = {
	error: null,
	products: null,
	productDetail: null,
	searchResult: null,
	loading: false,
	filterOption: null,
};

@Injectable({
	providedIn: 'root',
})
@StoreConfig({
	name: 'product',
})
export class ProductStore extends Store<ProductState> {
	constructor() {
		super(initialState);
	}
}
