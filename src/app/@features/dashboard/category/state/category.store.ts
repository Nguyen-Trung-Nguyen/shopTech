import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityStore, Store, StoreConfig } from '@datorama/akita';

export interface CategoryState {
	categories: any;
	parentCategories: any;
	error: HttpErrorResponse;
	category: any;
	expanedAddForm: boolean;
	loading: boolean;
}
const initialState: CategoryState = {
	categories: null,
	parentCategories: null,
	category: null,
	error: null,
	expanedAddForm: false,
	loading:false,
};

@Injectable({
	providedIn: 'root',
})
@StoreConfig({
	name: 'category',
	resettable: true,
})
export class CategoryStore extends Store<CategoryState> {
	constructor() {
		super(initialState);
	}
}
