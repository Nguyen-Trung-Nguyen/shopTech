import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
export interface GlobalState {
	user: any;
	categories: any;
	carts: Array<any>;
	totalItem: number;
	itemChecked: any;
	totalItemChecked: any;
	totalPriceChecked: any;
	statusCheckout: boolean;
}

const initialState: GlobalState = {
	user: null,
	categories: null,
	carts: [],
	totalItem: 0,
	itemChecked: [],
	totalItemChecked: 0,
	totalPriceChecked: 0,
	statusCheckout: false,
};
@Injectable({
	providedIn: 'root',
})
@StoreConfig({
	name: 'global',
})
export class GlobalStore extends Store<GlobalState> {
	constructor() {
		super(initialState);
	}
}
