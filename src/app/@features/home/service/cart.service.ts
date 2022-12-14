import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { GlobalStore } from 'src/app/@core/state/global.store';
import { handleError } from 'src/app/@shared/utils/handle-eror.utils';
import { environment } from 'src/environments/environment';
import { HomeStore } from '../state/home.store';
@Injectable({
	providedIn: 'root',
})
export class CartService {
	private CART_URL: string = `${environment.API_URL_BASE}/cart`;
	constructor(
		private http: HttpClient,
		private store: HomeStore,
		private globalStore: GlobalStore,
		@Inject(TuiAlertService)
		private readonly alertService: TuiAlertService
	) {}

	addCart(request: any) {
		return this.http.post<any>(this.CART_URL + '/add', request).pipe(
			tap((data) => {
				if (data) {
					this.globalStore.update((state) => ({
						user: {
							...state.user,
							totalItem: data.totalItem,
						},
					}));
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
	updateCart(request: any) {
		return this.http.put<any>(this.CART_URL, request).pipe(
			tap((data) => {
				if (data) {
					this.globalStore.update((state) => ({
						user: {
							...state.user,
							totalItem: data.totalItem,
						},
					}));
				}
			}),
			catchError((error: HttpErrorResponse) => {
				return of();
			})
		);
	}
	getAllCartItem(): Observable<any> {
		this.store.setLoading(true);
		return this.http.get<any>(this.CART_URL + '/list').pipe(
			tap((data) => {
				if (data) {
					this.store.update((state) => ({
						carts: data,
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

	deleteById(id: number): Observable<any> {
		return this.http.delete<any>(this.CART_URL + '/' + id).pipe(
			tap((data) => {
				this.store.update((state) => ({
					carts: state.carts.filter((e: any) => {
						return e.id !== id;
					}),
				}));

				this.globalStore.update((state) => ({
					user: {
						...state.user,
						totalItem: data.totalItem,
					},
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
	getCartItem(array: any): Observable<any> {
		this.store.setLoading(true);
		return this.http.post<any>(this.CART_URL + '/nouser', array).pipe(
			tap((data) => {
				if (data) {
					this.store.update((state) => ({
						carts: data,
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
	deleteCartItem(cartItemId: number) {
		this.store.update((state) => ({
			carts: state.carts.filter((e: any) => {
				return e.id !== cartItemId;
			}),
		}));

		this.globalStore.update((state) => ({
			carts: state.carts.filter((e: any) => {
				return e.id !== cartItemId;
			}),
		}));
		this.globalStore.update((state) => ({
			totalItem: this.calTotalItem(state.carts),
		}));
		this.alertService
			.open('Xóa Thành công', {
				label: 'Thông báo',
				status: TuiNotification.Success,
				autoClose: true,
			})
			.subscribe();
	}

	addCartItem(cartItem: any, arrayItem: Array<any>) {
		const availableCart = arrayItem.find((item) => item.productEntryId === cartItem.productEntryId);
		if (availableCart) {
			const assignAvailableCart = Object.assign({}, availableCart);
			assignAvailableCart.quantity += cartItem.quantity;
			this.globalStore.update((state) => ({
				carts: state.carts.map((item) => {
					if (item.productEntryId === assignAvailableCart.productEntryId) {
						return { ...item, quantity: assignAvailableCart.quantity };
					}
					return item;
				}),
			}));
		} else {
			this.globalStore.update((state) => ({
				carts: [...state.carts, cartItem],
			}));
		}
		this.globalStore.update((state) => ({
			totalItem: this.calTotalItem(state.carts),
		}));
		this.alertService
			.open('Thêm Thành công', {
				label: 'Thông báo',
				status: TuiNotification.Success,
				autoClose: true,
			})
			.subscribe();
	}
	calTotalItem(arrayItem: Array<any>): number {
		let totalItem = 0;
		if (arrayItem.length > 0) {
			arrayItem.forEach((item) => {
				totalItem += item.quantity;
			});
		}
		return totalItem;
	}
}
