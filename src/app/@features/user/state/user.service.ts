import {
	HttpClient,
	HttpErrorResponse,
	HttpEvent,
	HttpRequest,
	HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { LocalStorageService } from 'src/app/@core/service/local-storage.service';
import { GlobalStore } from 'src/app/@core/state/global.store';
import { handleError } from 'src/app/@shared/utils/handle-eror.utils';
import { environment } from 'src/environments/environment';
import { UserStore } from './user.store';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private URL: string = `${environment.API_URL_BASE}/user`;
	private URL_BASIC_INFOR = `${environment.API_URL_BASE}/user/basicinfor`;
	constructor(
		private http: HttpClient,
		private store: UserStore,
		private storage: LocalStorageService,
		private globalStore: GlobalStore,
		@Inject(TuiAlertService)
		private readonly alertService: TuiAlertService
	) {}

	getProfile(): Observable<any> {
		this.store.setLoading(true);
		return this.http.get<any>(this.URL + '/profile').pipe(
			tap((data) => {
				this.store.setLoading(false);
				this.store.update((state) => ({
					user: data,
				}));
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

	getBasicInfor() {
		return this.http.get<any>(this.URL_BASIC_INFOR).pipe(
			tap((data) => {
				if (data) {
					this.globalStore.update((state) => ({
						user: data,
					}));
				}
			})
		);
	}

	updateAvatar(file: File): Observable<HttpEvent<any>> {
		this.store.setLoading(true);
		const formData: FormData = new FormData();
		formData.append('file', file);
		const req = new HttpRequest('PUT', this.URL + '/avatar', formData);
		return this.http.request(req).pipe(
			tap((event: any) => {
				if (event instanceof HttpResponse) {
					this.store.setLoading(false);
					this.globalStore.update((state) => ({
						user: {
							...state.user,
							avatar: event.body.avatar,
						},
					}));
					this.alertService
						.open('Cập nhật thành công', {
							label: 'Thông báo',
							status: TuiNotification.Success,
							autoClose: true,
						})
						.subscribe();
				}
			}),
			catchError((error: HttpErrorResponse) => {
				this.store.setLoading(false);
				this.alertService
					.open('Cập nhật thất bại, xin vùi lòng thử lại sau', {
						label: 'Thông báo',
						status: TuiNotification.Error,
						autoClose: true,
					})
					.subscribe();
				return of();
			})
		);
	}
	updateUserById(user: any): Observable<any> {
		this.store.setLoading(true);
		return this.http.put<any>(this.URL, user).pipe(
			tap((data) => {
				this.store.setLoading(false);
				this.store.update((state) => ({
					user: data,
				}));
				this.globalStore.update((state) => ({
					user: {
						...state.user,
						fullname: data.fullname,
						avatarurl: data.avatar.url,
					},
				}));
				this.alertService
					.open('Cập nhật thành công', {
						label: 'Thông báo',
						status: TuiNotification.Success,
						autoClose: true,
					})
					.subscribe();
			}),
			catchError((error: HttpErrorResponse) => {
				this.store.setLoading(false);
				this.store.update((state) => ({
					error: handleError(error),
				}));
				this.alertService
					.open('Cập nhật thất bại, xin vùi lòng thử lại sau', {
						label: 'Thông báo',
						status: TuiNotification.Error,
						autoClose: true,
					})
					.subscribe();
				return of();
			})
		);
	}
}
