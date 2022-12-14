import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig } from '@datorama/akita';

export interface ColorState {
	colors: any;
	color: any;
	error: HttpErrorResponse;
	expanedAddForm: boolean;
}
const initialState: ColorState = {
	colors: null,
	color: null,
	error: null,
	expanedAddForm: false,
};

@Injectable({
	providedIn: 'root',
})
@StoreConfig({
	name: 'color',
	resettable: true,
})
export class ColorStore extends EntityStore<ColorState> {
	constructor() {
		super(initialState);
	}
}
