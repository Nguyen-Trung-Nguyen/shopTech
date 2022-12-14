import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { ImageState, ImageStore } from './image.store';
@Injectable({
	providedIn: 'root',
})
export class ImageQuery extends Query<ImageState> {
	constructor(protected store: ImageStore) {
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
