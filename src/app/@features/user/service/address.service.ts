import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { catchError, from, map, Observable, of, tap } from 'rxjs';
import { handleError } from 'src/app/@shared/utils/handle-eror.utils';
import { environment } from 'src/environments/environment';
import { UserStore } from '../state/user.store';

@Injectable({
	providedIn: 'root',
})
export class AddressService {
	private URL: string = `${environment.API_URL_BASE}/address`;

	constructor(
		private http: HttpClient,
		private store: UserStore,

		@Inject(TuiAlertService)
		private readonly alertService: TuiAlertService
	) {}

	getAll(): Observable<any> {
		this.store.setLoading(true);
		return this.http.get<any>(this.URL + '/list').pipe(
			tap((data) => {
				this.store.setLoading(false);
				this.store.update((state) => ({
					address: data,
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
	createAddress(data: any) {
		this.store.setLoading(true);
		return this.http.post<any>(this.URL + '/add', data).pipe(
			tap((data) => {
				this.store.setLoading(false);
				this.alertService
					.open('Thêm thành công', {
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
					.open('Thêm thất bại, xin vùi lòng thử lại sau', {
						label: 'Thông báo',
						status: TuiNotification.Error,
						autoClose: true,
					})
					.subscribe();
				return of();
			})
		);
	}
	updateAddress(id: number, data: any) {
		this.store.setLoading(true);
		return this.http.put<any>(this.URL + '/' + id, data).pipe(
			tap((data) => {
				this.store.setLoading(false);
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
	setDefault(id: number) {
		return this.http.put<any>(this.URL + '/default' + '/' + id, {}).pipe(
			tap((data) => {
				this.alertService
					.open('Cập nhật thành công', {
						label: 'Thông báo',
						status: TuiNotification.Success,
						autoClose: true,
					})
					.subscribe();
			}),
			catchError((error: HttpErrorResponse) => {
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
	deleteById(id: number): Observable<any> {
		return this.http.delete<any>(this.URL + '/' + id).pipe(
			tap((data) => {
				this.store.update((state) => ({
					address: state.address.filter((e: any) => {
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

	findById(id: number): Observable<any> {
		return this.http.get<any>(this.URL + '/' + id).pipe(
			tap((data) => {}),
			catchError((error: HttpErrorResponse) => {
				this.store.update((state) => ({
					error: handleError(error),
				}));
				return of();
			})
		);
	}
	fetchProvinces(url: string) {
		return from(
			fetch(url, {
				method: `GET`,
			}).then((response) => response.json())
		).pipe(
			map((response) => {
				return response.results;
			}),
			map((res: Array<any>) => {
				return res.map((item) => ({
					...item,
					name: item.province_name,
				}));
			})
		);
	}

	fetchDistricts(url: string) {
		return from(
			fetch(url, {
				method: `GET`,
			}).then((response) => response.json())
		).pipe(
			map((response) => {
				return response.results;
			}),
			map((res: Array<any>) => {
				return res.map((item) => ({
					...item,
					name: item.district_name,
				}));
			})
		);
	}

	fetchWards(url: string) {
		return from(
			fetch(url, {
				method: `GET`,
			}).then((response) => response.json())
		).pipe(
			map((response) => {
				return response.results;
			}),
			map((res: Array<any>) => {
				return res.map((item) => ({
					...item,
					name: item.ward_name,
				}));
			})
		);
	}
}
