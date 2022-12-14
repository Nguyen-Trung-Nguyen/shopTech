import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';

import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { catchError, Observable, of, tap } from 'rxjs';
import { AlertNotificationComponent } from 'src/app/@shared/component/alert-notification/alert-notification.component';
import { handleError } from 'src/app/@shared/utils/handle-eror.utils';
import { environment } from 'src/environments/environment';
import { OrderStore } from './order.store';
@Injectable({
	providedIn: 'root',
})
export class OrderService {
	private URL: string = `${environment.API_URL_BASE}/order`;

	constructor(
		private http: HttpClient,
		private store: OrderStore,
		@Inject(TuiAlertService)
		private readonly alertService: TuiAlertService,
		@Inject(Injector) private readonly injector: Injector
	) {}

	getAll(): Observable<any> {
		this.store.setLoading(true);
		return this.http.get<any>(this.URL).pipe(
			tap((data) => {
				if (data) {
					this.store.update((state) => ({
						orders: data,
					}));
					this.store.setLoading(false);
				}
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
	findById(id: number) {
		this.store.setLoading(true);
		return this.http.get<any>(this.URL + '/' + id).pipe(
			tap((data) => {
				if (data) {
					this.store.setLoading(false);
					this.store.update((state) => ({
						order: data,
					}));
				}
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
	updateById(id: number, request: any) {
		this.store.setLoading(true);
		return this.http.put<any>(this.URL + '/' + id, request).pipe(
			tap((data) => {
				if (data) {
					this.store.setLoading(false);
					this.alertService
						.open('C???p nh???t th??nh c??ng', {
							label: 'Th??ng b??o',
							status: TuiNotification.Success,
							autoClose: true,
						})
						.subscribe();
				}
			}),
			catchError((error: HttpErrorResponse) => {
				this.store.setLoading(false);
				this.alertService
					.open('C???p nh th???t b???i, xin v??i l??ng th??? l???i sau', {
						label: 'Th??ng b??o',
						status: TuiNotification.Error,
						autoClose: true,
					})
					.subscribe();
				this.store.update((state) => ({
					error: handleError(error),
				}));

				return of();
			})
		);
	}
	search(search: string): Observable<any> {
		let params = new HttpParams();
		params = params.append('keyword', search);
		return this.http
			.get<any>(this.URL + '/search', {
				params,
			})
			.pipe(
				tap((data) => {
					if (data) {
						this.store.update((state) => ({
							searchResult: data,
						}));
						this.store.setLoading(false);
					}
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
	filter(status: string): Observable<any> {
		let params = new HttpParams();
		params = params.append('status', status);
		return this.http
			.get<any>(this.URL + '/filter', {
				params,
			})
			.pipe(
				tap((data) => {
					if (data) {
						this.store.update((state) => ({
							orders: data,
						}));
						this.store.setLoading(false);
					}
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
	deleteById(id: number): Observable<any> {
		return this.http.delete<any>(this.URL + '/' + id).pipe(
			tap((data) => {
				this.store.update((state) => ({
					orders: state.orders.filter((e: any) => {
						return e.id !== id;
					}),
				}));
				this.alertService
					.open('X??a Th??nh c??ng', {
						label: 'Th??ng b??o',
						status: TuiNotification.Success,
						autoClose: true,
					})
					.subscribe();
			}),
			catchError((error: HttpErrorResponse) => {
				this.alertService
					.open<any>(new PolymorpheusComponent(AlertNotificationComponent, this.injector), {
						label: 'Th??ng b??o',
						data: error,
						status: TuiNotification.Error,
						autoClose: false,
					})
					.subscribe();
				return of();
			})
		);
	}
}
