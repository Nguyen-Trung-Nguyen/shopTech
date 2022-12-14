import {
	HttpClient,
	HttpErrorResponse,
	HttpParams,
	HttpRequest,
	HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { catchError, Observable, of, tap } from 'rxjs';
import { AlertNotificationComponent } from 'src/app/@shared/component/alert-notification/alert-notification.component';
import { handleError } from 'src/app/@shared/utils/handle-eror.utils';
import { environment } from 'src/environments/environment';
import { ImageStore } from './image.store';
@Injectable({
	providedIn: 'root',
})
export class ImageService {
	private URL: string = `${environment.API_URL_BASE}/image`;

	constructor(
		private http: HttpClient,
		private store: ImageStore,
		@Inject(TuiAlertService)
		private readonly alertService: TuiAlertService,
		@Inject(Injector) private readonly injector: Injector
	) {}
	getAll(content: any): Observable<any> {
		this.store.setLoading(true);
		let params = new HttpParams();
		params = params.append('content', content);
		return this.http
			.get<any>(this.URL, {
				params,
			})
			.pipe(
				tap((data) => {
					if (data) {
						this.store.update((state) => ({
							images: data,
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

	create(file: File, data: any): Observable<any> {
		this.store.setLoading(true);
		const formData: FormData = new FormData();
		formData.append('file', file);
		formData.append('content', new Blob([JSON.stringify(data)], { type: 'application/json' }));
		const req = new HttpRequest('POST', this.URL + '/add', formData, {
			responseType: 'json',
		});
		return this.http.request(req).pipe(
			tap((event: any) => {
				if (event instanceof HttpResponse) {
					this.store.setLoading(false);
					this.alertService
						.open('Thêm Thành công', {
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
					.open<any>(new PolymorpheusComponent(AlertNotificationComponent, this.injector), {
						label: 'Thông báo',
						data: error,
						status: TuiNotification.Error,
						autoClose: false,
					})
					.subscribe();
				return of();
			})
		);
	}

	updateById(id: number, file: File, data: any): Observable<any> {
		this.store.setLoading(true);
		const formData: FormData = new FormData();
		const url = this.URL + '/' + id;
		formData.append('file', file);
		formData.append('content', new Blob([JSON.stringify(data)], { type: 'application/json' }));
		const req = new HttpRequest('PUT', url, formData, {
			responseType: 'json',
		});

		return this.http.request(req).pipe(
			tap((event: any) => {
				if (event instanceof HttpResponse) {
					this.store.setLoading(false);
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
					.open<any>(new PolymorpheusComponent(AlertNotificationComponent, this.injector), {
						label: 'Thông báo',
						data: error,
						status: TuiNotification.Error,
						autoClose: false,
					})
					.subscribe();
				return of();
			})
		);
	}

	deleteById(id: number): Observable<any> {
		this.store.setLoading(true);
		return this.http.delete<any>(this.URL + '/' + id).pipe(
			tap((data) => {
				this.store.setLoading(false);
				this.store.update((state) => ({
					images: state.images.filter((e: any) => {
						return e.id !== id;
					}),
				}));
				this.alertService
					.open('Xóa Thành công', {
						label: 'Thông báo',
						status: TuiNotification.Success,
						autoClose: true,
					})
					.subscribe();
			}),
			catchError((error: HttpErrorResponse) => {
				this.store.setLoading(false);
				this.alertService
					.open<any>(new PolymorpheusComponent(AlertNotificationComponent, this.injector), {
						label: 'Thông báo',
						data: error,
						status: TuiNotification.Error,
						autoClose: false,
					})
					.subscribe();
				return of();
			})
		);
	}
	findById(id: number) {
		return this.http.get<any>(this.URL + '/' + id).pipe(
			tap((data) => {
				if (data) {
					this.store.update((state) => ({
						image: data,
					}));
				}
			}),
			catchError((error: HttpErrorResponse) => {
				this.store.update((state) => ({
					error: handleError(error),
				}));
				return of();
			})
		);
	}
}
