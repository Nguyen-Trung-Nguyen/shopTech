import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TUI_NUMBER_FORMAT } from '@taiga-ui/core';
import { combineLatest, Observable, tap } from 'rxjs';
import { GlobalQuery } from 'src/app/@core/state/global.query';
import { GlobalStore } from 'src/app/@core/state/global.store';
import { AuthService } from 'src/app/@features/auth/state/auth.service';
import { AddressService } from 'src/app/@features/user/service/address.service';
import { CartService } from '../../service/cart.service';
import { MyOrderService } from '../../service/my-order.service';
import { HomeQuery } from '../../state/home.query';
@Component({
	selector: 'app-checkout-page',
	templateUrl: './checkout-page.component.html',
	styleUrls: ['./checkout-page.component.scss'],
	providers: [
		{
			provide: TUI_NUMBER_FORMAT,
			useValue: { decimalSeparator: `,`, thousandSeparator: `.` },
		},
	],
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
	addressList$: Observable<any>;
	address: any;
	itemChecked$: Observable<any>;
	totalItemChecked$: Observable<any>;
	totalPriceChecked$: Observable<any>;
	description: string = '';
	soonGetProductTime = new Date();
	lateGetProductTIme = new Date();
	shippingMethod: Array<any> = [
		{
			name: 'Vận chuyển tiêu chuẩn',
			description: 'Miễn phí giao hàng (Phí vận chuyển: 0đ)',
		},
		{
			name: 'Nhận hàng tại cửa hàng',
			description: 'Nhấn vào đây để xem địa chỉ',
		},
	];
	shipping: any = this.shippingMethod[0];
	paymentMethod: Array<any> = [
		{
			name: 'Thanh toán khi nhận hàng',
		},
	];
	isLoggedIn: boolean = false;
	payment: any = this.paymentMethod[0];
	disabled: boolean = false;
	clientUser: any = null;
	items: Array<any> = [];
	loading$: Observable<boolean>;
	carts: Array<any>;
	itemCheckedes: Array<any>;
	constructor(
		private addressService: AddressService,
		private globalQuery: GlobalQuery,
		private globalStore: GlobalStore,
		private authService: AuthService,
		private myorderService: MyOrderService,
		private homeQuery: HomeQuery,
		private cartService: CartService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.fetchInit();
		this.initValue();
		this.calTime();
		this.itemChecked$ = this.globalQuery.select('itemChecked');
		this.totalItemChecked$ = this.globalQuery.select('totalItemChecked');
		this.totalPriceChecked$ = this.globalQuery.select('totalPriceChecked');
		this.loading$ = this.homeQuery.select('loading');
		this.itemChecked$
			.pipe(
				tap((data) => {
					if (data.length > 0) {
						this.items = data.map((item: any) => ({
							productEntryId: item.productEntry.id,
							quantity: item.quantity,
						}));
					}
				})
			)
			.subscribe();
		this.filterCarts();
		window.onbeforeunload = () => this.ngOnDestroy();
	}
	fetchInit() {
		if (this.authService.isLoggedIn()) {
			this.addressList$ = this.addressService.getAll();
			this.isLoggedIn = this.authService.isLoggedIn();
		}
	}
	getInformation($event: any) {
		const data = $event.data;
		if (data) {
			this.disabled = data.disabled;
			this.clientUser = data.clientUser;
		}
	}
	initValue() {
		if (this.authService.isLoggedIn()) {
			this.addressList$
				.pipe(
					tap((data) => {
						if (data) {
							this.address = data[0];
						}
					})
				)
				.subscribe();
		}
	}
	calTime() {
		this.soonGetProductTime.setDate(this.soonGetProductTime.getDate() + 4);
		this.lateGetProductTIme.setDate(this.lateGetProductTIme.getDate() + 8);
	}

	onOrder() {
		var request = null;
		if (!this.isLoggedIn) {
			request = {
				clientUser: this.clientUser,
				description: this.description,
				paymentMethod: this.payment.name,
				shippingMethod: this.shipping.name,
				items: this.items,
			};
		} else {
			request = {
				description: this.description,
				addressId: this.address.id,
				paymentMethod: this.payment.name,
				shippingMethod: this.shipping.name,
				items: this.items,
			};
		}

		this.myorderService
			.createOrder(request)
			.pipe(
				tap((data) => {
					if (data) {
						if (this.isLoggedIn) {
							this.cartService
								.updateCart(this.filterCartAfterOrder(this.carts, this.itemCheckedes))
								.subscribe();
						} else {
							this.globalStore.update((state) => ({
								carts: this.filterCartAfterOrder(this.carts, this.itemCheckedes),
								totalItem: this.calTotalItem(
									this.filterCartAfterOrder(this.carts, this.itemCheckedes)
								),
							}));
						}
						this.router.navigate(['/checkout/success']);
						this.globalStore.update((state) => ({
							statusCheckout: true,
						}));
					}
				})
			)
			.subscribe();
	}

	filterCartAfterOrder(carts: Array<any>, itemChecked: Array<any>) {
		let filterItemChecked = itemChecked.map((i) => i.id);
		let afterFilterCart: Array<any> = [];
		let filterCart = carts.filter((cart) => {
			return !filterItemChecked.some((item) => {
				if (cart.quantity > 1 && cart.id === item) {
					const itemIsCheck = itemChecked.find((item) => item.id === cart.id);
					const anyCart = {
						...cart,
						quantity: cart.quantity - itemIsCheck.quantity,
					};
					afterFilterCart.push(anyCart);
					return cart;
				}
				if (cart.quantity === 1 && cart.id === item) {
					return cart.id === item;
				}
			});
		});
		let completeFilterCart = filterCart.concat(afterFilterCart).filter((item) => item.quantity > 0);
		return completeFilterCart;
	}

	filterCarts() {
		let carts$: Observable<any>;
		if (this.isLoggedIn) {
			carts$ = this.cartService.getAllCartItem();
		} else {
			carts$ = this.globalQuery.select('carts');
		}
		combineLatest({
			sourceOne: carts$,
			sourceTwo: this.itemChecked$,
		})
			.pipe(
				tap((data) => {
					if (data) {
						this.carts = data.sourceOne;
						this.itemCheckedes = data.sourceTwo;
					}
				})
			)
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

	ngOnDestroy(): void {
		this.globalStore.update((state) => ({
			itemChecked: [],
			totalItemChecked: 0,
			totalPriceChecked: 0,
		}));
	}
}
