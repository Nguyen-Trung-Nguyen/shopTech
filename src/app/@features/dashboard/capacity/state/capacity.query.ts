import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CapacityState, CapacityStore } from './capacity.store';
@Injectable({
	providedIn: 'root',
})
export class CapacityQuery extends QueryEntity<CapacityState> {
	constructor(protected store: CapacityStore) {
		super(store);
	}

	toggleAddform() {
		this.store.update((state) => ({
			expanedAddForm: !state.expanedAddForm,
		}));
	}
	setExpanedAddForm(value: boolean) {
		this.store.update((state) => ({
			expanedAddForm: value,
		}));
	}
}
