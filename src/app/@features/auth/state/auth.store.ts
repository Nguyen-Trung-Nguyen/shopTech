import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig } from '@datorama/akita';
import { MessageResponse } from 'src/app/@shared/models/message-response.model';

export interface AuthState {
	messageResponse: MessageResponse;
	loading: boolean;
	error: HttpErrorResponse;
	isOpenLogin: boolean;
}

const initialState: AuthState = {
	messageResponse: {
		message: '',
	},
	loading: false,
	error: null,
	isOpenLogin: false,
};
@Injectable({
	providedIn: 'root',
})
@StoreConfig({
	name: 'auth',
	resettable: true,
})
export class AuthStore extends EntityStore<AuthState> {
	constructor() {
		super(initialState);
	}
}
