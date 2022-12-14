import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface ImageState {
	error: HttpErrorResponse;
	images: any;
	image: any;
	loading: boolean;
	expanedAddForm: boolean;
}
const initialState: ImageState = {
	error: null,
	images: null,
	image: null,
	loading: false,
	expanedAddForm: false,
};

@Injectable({
	providedIn: 'root',
})
@StoreConfig({
	name: 'images',
	resettable: true,
})
export class ImageStore extends Store<ImageState> {
	constructor() {
		super(initialState);
	}
}
