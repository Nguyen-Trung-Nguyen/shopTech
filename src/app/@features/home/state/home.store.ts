import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface HomeState {
	error: HttpErrorResponse;
	products: any;
	productDetail: any;
	loading: boolean;
	searchResult: any;
	categories: any;
	carts: any;
	notifications: any;
}
const initialState: HomeState = {
	error: null,
	products: null,
	productDetail: null,
	loading: false,
	searchResult: null,
	categories: null,
	carts: null,
	notifications: null,
};

@Injectable({
	providedIn: 'root',
})
@StoreConfig({
	name: 'home',
	resettable: true,
})
export class HomeStore extends Store<HomeState> {
	constructor() {
		super(initialState);
	}
}
