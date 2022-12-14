import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageResponse } from 'src/app/@shared/models/message-response.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthState, AuthStore } from './auth.store';

@Injectable({
	providedIn: 'root',
})
export class AuthQuery extends QueryEntity<AuthState> {
	messageResponse$: Observable<MessageResponse> = this.select('messageResponse');
	error$: Observable<HttpErrorResponse> = this.select('error');
	constructor(protected store: AuthStore) {
		super(store);
	}
}
