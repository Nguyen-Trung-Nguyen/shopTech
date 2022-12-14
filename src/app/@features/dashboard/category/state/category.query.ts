import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Observable } from 'rxjs';
import { CategoryState, CategoryStore } from './category.store';
@Injectable({
	providedIn: 'root',
})
export class CategoryQuery extends Query<CategoryState> {
	cateogires$: Observable<any> = this.select('categories');
	error$: Observable<HttpErrorResponse> = this.select('error');
	constructor(protected store: CategoryStore) {
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
