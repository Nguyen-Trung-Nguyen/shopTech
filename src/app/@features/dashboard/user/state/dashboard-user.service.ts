import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { TuiAlertService } from '@taiga-ui/core';

import { catchError, Observable, of, tap } from 'rxjs';
import { handleError } from 'src/app/@shared/utils/handle-eror.utils';
import { environment } from 'src/environments/environment';
import { DashboardUserStore } from './dashboard-user-store';
@Injectable({
	providedIn: 'root',
})
export class DashboardUserService {
	private URL: string = `${environment.API_URL_BASE}/user`;

	constructor(
		private http: HttpClient,
		private store: DashboardUserStore,
		@Inject(TuiAlertService)
		private readonly alertService: TuiAlertService,
		@Inject(Injector) private readonly injector: Injector
	) {}

	getAll(): Observable<any> {
		this.store.setLoading(true);
		return this.http.get<any>(this.URL + '/list').pipe(
			tap((data) => {
				if (data) {
					this.store.update((state) => ({
						users: data,
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
		return this.http.get<any>(this.URL + '/userdetail' + '/' + id).pipe(
			tap((data) => {
				if (data) {
					this.store.setLoading(false);
					this.store.update((state) => ({
						user: data,
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
}
