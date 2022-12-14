import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { GlobalStore } from 'src/app/@core/state/global.store';
import { environment } from 'src/environments/environment';

import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { catchError, of, tap } from 'rxjs';
import { HomeStore } from 'src/app/@features/home/state/home.store';
@Injectable({
	providedIn: 'root',
})
export class NotificationService {
	private URL_NOTIFICATION: string = `${environment.API_URL_BASE}/notification`;

	constructor(
		private http: HttpClient,
		private store: GlobalStore,
		private homeStore: HomeStore,
		@Inject(TuiAlertService)
		private readonly alertService: TuiAlertService
	) {}

	updateTotalNoti() {
		return this.http.get<any>(this.URL_NOTIFICATION + '/total').pipe(
			tap((data) => {
				if (data) {
					this.store.update((state) => ({
						user: { ...state.user, totalNoti: data.total },
					}));
				}
			}),
			catchError((error) => {
				return of();
			})
		);
	}
	getAllByUserId(isRead: string) {
		let params = new HttpParams();
		params = params.append('isRead', isRead);
		return this.http
			.get<any>(this.URL_NOTIFICATION + '/list', {
				params,
			})
			.pipe(
				tap((data) => {
					if (data) {
						this.homeStore.update((state) => ({
							notifications: data,
						}));
					}
				}),
				catchError((error) => {
					return of();
				})
			);
	}
	setIsRead(id: number) {
		return this.http.get<any>(this.URL_NOTIFICATION + '/isread/' + id).pipe(
			tap((data) => {
				if (data) {
				}
			}),
			catchError((error) => {
				return of();
			})
		);
	}
	deleteByid(id: number) {
		return this.http.delete<any>(this.URL_NOTIFICATION + '/' + id).pipe(
			tap((data) => {
				if (data) {
					this.homeStore.update((state) => ({
						notifications: state.notifications.filter((data: any) => data.id !== id),
					}));
					this.alertService
						.open('Xóa Thành công', {
							label: 'Thông báo',
							status: TuiNotification.Success,
							autoClose: true,
						})
						.subscribe();
				}
			}),
			catchError((error) => {
				this.alertService
					.open('Xóa thất bại, xin vùi lòng thử lại sau', {
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
