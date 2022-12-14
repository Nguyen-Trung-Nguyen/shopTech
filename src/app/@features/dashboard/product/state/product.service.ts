import {
	HttpClient,
	HttpErrorResponse,
	HttpParams,
	HttpRequest,
	HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { catchError, Observable, of, tap } from 'rxjs';
import { ImageProcessingService } from 'src/app/@core/service/image-processing.service';
import { AlertNotificationComponent } from 'src/app/@shared/component/alert-notification/alert-notification.component';
import { handleError } from 'src/app/@shared/utils/handle-eror.utils';
import { stringToSlug } from 'src/app/@shared/utils/string.utils';
import { environment } from 'src/environments/environment';
import { ProductStore } from './product.store';
@Injectable({
	providedIn: 'root',
})
export class ProductService {
	private URL: string = `${environment.API_URL_BASE}/product`;

	constructor(
		private http: HttpClient,
		private store: ProductStore,
		@Inject(TuiAlertService)
		private readonly alertService: TuiAlertService,
		@Inject(Injector) private readonly injector: Injector,
		private ImagerService: ImageProcessingService,
		private sanitizer: DomSanitizer
	) {}

	getAll(): Observable<any> {
		this.store.setLoading(true);
		return this.http.get<any>(this.URL).pipe(
			tap((data) => {
				if (data) {
					this.store.update((state) => ({
						products: data,
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

	getAllByCategory(slug: any): Observable<any> {
		this.store.setLoading(true);
		let params = new HttpParams();
		params = params.append('category', slug);
		return this.http
			.get<any>(this.URL + '/category', {
				params,
			})
			.pipe(
				tap((data) => {
					if (data) {
						this.store.update((state) => ({
							products: data,
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
	search(search: string): Observable<any> {
		let params = new HttpParams();
		let searchEncode = stringToSlug(search);
		params = params.append('keyword', searchEncode);
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
	create(request: any, productEntry: any, images: any, thumbnail: any): Observable<any> {
		this.store.setLoading(true);
		const formData: FormData = new FormData();
		for (let image of images) {
			formData.append('images', image);
		}

		formData.append('thumbnail', thumbnail);
		formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
		formData.append(
			'productEntry',
			new Blob([JSON.stringify(productEntry)], { type: 'application/json' })
		);
		const req = new HttpRequest('POST', this.URL + '/add', formData);
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
	updateBySlug(
		slug: string,
		productEntry: any,
		request: any,
		images: any,
		thumbnail: File
	): Observable<any> {
		this.store.setLoading(true);
		const formData: FormData = new FormData();
		for (let image of images) {
			formData.append('images', image);
		}
		formData.append('thumbnail', thumbnail);
		formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
		formData.append(
			'productEntry',
			new Blob([JSON.stringify(productEntry)], { type: 'application/json' })
		);
		const req = new HttpRequest('PUT', this.URL + '/' + slug, formData);
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
				console.log(error);
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
	findBySlug(slug: string) {
		this.store.setLoading(true);
		return this.http.get<any>(this.URL + '/' + slug).pipe(
			tap((data) => {
				if (data) {
					this.store.setLoading(false);
					this.store.update((state) => ({
						productDetail: data,
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
	deleteById(id: number): Observable<any> {
		return this.http.delete<any>(this.URL + '/' + id).pipe(
			tap((data) => {
				this.store.update((state) => ({
					products: state.products.filter((e: any) => {
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
}
