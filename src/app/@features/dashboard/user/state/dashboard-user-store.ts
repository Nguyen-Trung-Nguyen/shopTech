import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface DashboardUserState {
	error: HttpErrorResponse;
	users: any;
	loading: boolean;
	user: any;
}
const initialState: DashboardUserState = {
	error: null,
	users: null,
	loading: false,
	user: null,
};

@Injectable({
	providedIn: 'root',
})
@StoreConfig({
	name: 'dashboard-user',
	resettable: true,
})
export class DashboardUserStore extends Store<DashboardUserState> {
	constructor() {
		super(initialState);
	}
}
