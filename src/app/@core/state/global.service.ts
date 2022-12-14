import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GlobalStore } from './global.store';

@Injectable({
	providedIn: 'root',
})
export class GlobalService {
	private URL_CATEGORY: string = `${environment.API_URL_BASE}/category`;
	constructor(private http: HttpClient, private store: GlobalStore) {}
	getAllCat(filter: any): Observable<any> {
		let params = new HttpParams();
		if (filter) {
			params = params.append('filter', filter.value);
		}
		return this.http
			.get<any>(this.URL_CATEGORY, {
				params,
			})
			.pipe(
				tap((data) => {
					if (data) {
						this.store.update((state) => ({
							categories: data,
						}));
					}
				}),
				catchError((error: HttpErrorResponse) => {
					return of();
				})
			);
	}
}
