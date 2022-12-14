import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { catchError, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HomeStore } from '../state/home.store';
@Injectable({
	providedIn: 'root',
})
export class MyOrderService {
	private ORDER_URL: string = `${environment.API_URL_BASE}/order`;
	constructor(
		private http: HttpClient,
		private store: HomeStore,
		@Inject(TuiAlertService)
		private readonly alertService: TuiAlertService
	) {}
	createOrder(request: any) {
		this.store.setLoading(true);
		return this.http.post<any>(this.ORDER_URL + '/add', request).pipe(
			tap((data) => {
				if (data) {
					this.alertService
						.open('Đặt hàng thành công', {
							label: 'Thông báo',
							status: TuiNotification.Success,
							autoClose: true,
						})
						.subscribe();
					this.store.setLoading(false);
				}
			}),
			catchError((error: HttpErrorResponse) => {
				this.store.setLoading(false);
				this.alertService
					.open('Đặt hàng thất bại, xin vùi lòng thử lại sau', {
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
