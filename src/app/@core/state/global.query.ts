import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { GlobalState, GlobalStore } from './global.store';

@Injectable({
	providedIn: 'root',
})
export class GlobalQuery extends Query<GlobalState> {
	constructor(protected store: GlobalStore) {
		super(store);
	}

	addCart() {}
}
