import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { handleError } from 'src/app/@shared/utils/handle-eror.utils';
import { environment } from 'src/environments/environment';
import { HomeStore } from './home.store';
@Injectable({
	providedIn: 'root',
})
export class HomeService {
	private PRODUCT_URL: string = `${environment.API_URL_BASE}/product/template`;
	private IMAGE_RUL: string = `${environment.API_URL_BASE}/image`;
	private CART_URL: string = `${environment.API_URL_BASE}/cart`;
	constructor(private http: HttpClient, private store: HomeStore) {}

	getAllByCategory(slug: any, page: number): Observable<any> {
		this.store.setLoading(true);
		let params = new HttpParams();
		params = params.append('category', slug);
		params = params.append('page', page);
		return this.http
			.get<any>(this.PRODUCT_URL + '/category/', {
				params,
			})
			.pipe(
				tap((data) => {
					if (data) {
						this.store.setLoading(false);
						this.store.update((state) => ({
							products: data,
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

	getAllByCat(slug: any, page: number): Observable<any> {
		this.store.setLoading(true);
		let params = new HttpParams();
		params = params.append('category', slug);
		params = params.append('page', page);
		return this.http
			.get<any>(this.PRODUCT_URL + '/category/', {
				params,
			})
			.pipe(
				tap((data) => {}),
				catchError((error: HttpErrorResponse) => {
					this.store.setLoading(false);
					this.store.update((state) => ({
						error: handleError(error),
					}));
					return of();
				})
			);
	}

	getImageByContent(content: any): Observable<any> {
		let params = new HttpParams();
		params = params.append('content', content);
		return this.http
			.get<any>(this.IMAGE_RUL, {
				params,
			})
			.pipe(
				tap((data) => {}),
				catchError((error: HttpErrorResponse) => {
					this.store.update((state) => ({
						error: handleError(error),
					}));
					return of();
				})
			);
	}
	findBySlug(slug: string) {
		this.store.setLoading(true);
		return this.http.get<any>(this.PRODUCT_URL + '/' + slug).pipe(
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

	search(keyword: string, page: number, size: number): Observable<any> {
		let params = new HttpParams();
		params = params.append('keyword', keyword);
		params = params.append('page', page);
		params = params.append('size', size);

		return this.http
			.get<any>(this.PRODUCT_URL + '/search', {
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
	searchResult(keyword: string, page: number, size: number): Observable<any> {
		let params = new HttpParams();
		params = params.append('keyword', keyword);
		params = params.append('page', page);
		params = params.append('size', size);

		return this.http
			.get<any>(this.PRODUCT_URL + '/search', {
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

	
}
