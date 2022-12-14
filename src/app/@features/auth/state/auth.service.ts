import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { LocalStorageService } from 'src/app/@core/service/local-storage.service';
import { RoleAuthorisationService } from 'src/app/@core/service/role-authorisation.service';
import { StompService } from 'src/app/@core/service/stomp.service';
import { GlobalStore } from 'src/app/@core/state/global.store';
import { MessageResponse } from 'src/app/@shared/models/message-response.model';
import { handleError } from 'src/app/@shared/utils/handle-eror.utils';
import { environment } from 'src/environments/environment';
import { AuthStore } from './auth.store';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private URL_SIGNUP: string = `${environment.API_URL_AUTH}/signup`;
	private URL_SIGNIN: string = `${environment.API_URL_AUTH}/signin`;
	private URL_REFRESHTOKEN: string = `${environment.API_URL_AUTH}/refreshtoken`;
	private URL_LOGOUT: string = `${environment.API_URL_AUTH}/logout`;
	constructor(
		private http: HttpClient,
		private store: AuthStore,
		private localStorage: LocalStorageService,
		private roleService: RoleAuthorisationService,
		private globalStore: GlobalStore,
		private stopmService: StompService
	) {}
	signup(user: any) {
		this.store.setLoading(true);
		return this.http.post<MessageResponse>(this.URL_SIGNUP, user).pipe(
			tap((data) => {
				if (data) {
		
					this.store.update((state) => ({
						messageResponse: data,
					}));
				}
				this.store.setLoading(false);
			}),
			catchError((error: HttpErrorResponse) => {
				this.store.setLoading(false);
				this.store.update((state) => ({
					error: handleError(error),
				}));
				return of();
			})
		);
	}
	login(loginInfor: any) {
		this.store.setLoading(true);
		return this.http.post<any>(this.URL_SIGNIN, loginInfor).pipe(
			tap((data) => {
				if (data) {
					this.localStorage.saveToken(data.accessToken);
					this.localStorage.saveRefreshToken(data.refreshToken);
					location.href = '/';
				}
				this.store.setLoading(false);
			}),
			catchError((error) => {
				this.store.setLoading(false);
				this.store.update((state) => ({
					error: handleError(error),
				}));
				return of();
			})
		);
	}
	logout() {
		const userId = this.roleService.getUserId();
		return this.http.get<any>(this.URL_LOGOUT + '/' + userId).pipe(
			tap((data) => {
				if (data) {
					this.localStorage.deleteAllToken();
					this.stopmService.disconnect();
					this.globalStore.update((state) => ({
						user: null,
					}));
					location.href = '/auth/dang-nhap';
				}
			})
		);
	}

	isLoggedIn(): boolean {
		if (this.localStorage.getRefreshToken()) {
			return true;
		}
		return false;
	}
	refreshToken() {
		const request = {
			refreshToken: this.localStorage.getRefreshToken(),
		};
		return this.http.post(this.URL_REFRESHTOKEN, request);
	}
}
