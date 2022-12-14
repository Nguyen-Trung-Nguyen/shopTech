import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Observable } from 'rxjs';
import { UserState, UserStore } from './user.store';
@Injectable({
	providedIn: 'root',
})
export class UserQuery extends Query<UserState> {
	user$: Observable<any> = this.select('user');
	error$: Observable<HttpErrorResponse> = this.select('error');
	constructor(protected store: UserStore) {
		super(store);
	}

	toggleAddform() {
		this.store.update((state) => ({
			expanedAddressForm: !state.expanedAddressForm,
		}));
	}
	setExpanedAddForm(value: boolean) {
		this.store.update((state) => ({
			expanedAddressForm: value,
		}));
	}
	toggleEditAddressForm() {
		this.store.update((state) => ({
			expanedEditAddressForm: !state.expanedEditAddressForm,
		}));
	}
	setExpanedEditAddressForm(value: boolean) {
		this.store.update((state) => ({
			expanedEditAddressForm: value,
		}));
	}
}
