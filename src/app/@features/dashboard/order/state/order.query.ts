import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { OrderState, OrderStore } from './order.store';
@Injectable({
	providedIn: 'root',
})
export class OrderQuery extends Query<OrderState> {
	constructor(protected store: OrderStore) {
		super(store);
	}
}
