import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface OrderState {
	error: HttpErrorResponse;
	orders: any;
	loading: boolean;
	order: any;
	statusFilter: any;
	searchResult: any;
}
const initialState: OrderState = {
	error: null,
	orders: null,
	loading: false,
	order: null,
	statusFilter: null,
	searchResult: null,
};

@Injectable({
	providedIn: 'root',
})
@StoreConfig({
	name: 'order',
})
export class OrderStore extends Store<OrderState> {
	constructor() {
		super(initialState);
	}
}
