import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { ColorState, ColorStore } from './color.store';
@Injectable({
	providedIn: 'root',
})
export class ColorQuery extends QueryEntity<ColorState> {
	constructor(protected store: ColorStore) {
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
