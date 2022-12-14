import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface UserState {
	user: any;
	error: HttpErrorResponse;
	loading: boolean;
	address: any;
	expanedAddressForm: boolean;
	expanedEditAddressForm: boolean;
}
const initialState: UserState = {
	user: null,
	error: null,
	loading: false,
	address: null,
	expanedAddressForm: false,
	expanedEditAddressForm: false,
};

@Injectable({
	providedIn: 'root',
})
@StoreConfig({
	name: 'user',
	resettable: true,
})
export class UserStore extends Store<UserState> {
	constructor() {
		super(initialState);
	}
}
