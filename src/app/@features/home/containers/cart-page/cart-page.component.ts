import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TuiTableBarsService } from '@taiga-ui/addon-tablebars';
import { TUI_NUMBER_FORMAT } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { map, Observable, Subject, Subscription, switchMap } from 'rxjs';
import { GlobalQuery } from 'src/app/@core/state/global.query';
import { GlobalStore } from 'src/app/@core/state/global.store';
import { AuthService } from 'src/app/@features/auth/state/auth.service';
import { CartService } from '../../service/cart.service';
import { HomeQuery } from '../../state/home.query';
import { HomeStore } from '../../state/home.store';
@Component({
	selector: 'app-cart-page',
	templateUrl: './cart-page.component.html',
	styleUrls: ['./cart-page.component.scss'],
	providers: [
		{
			provide: TUI_NUMBER_FORMAT,
			useValue: { decimalSeparator: `,`, thousandSeparator: `.` },
		},
	],
})
export class CartPageComponent implements OnInit, OnDestroy {
	@ViewChild(`tableBarTemplate`)
	tableBarTemplate: PolymorpheusContent = ``;
	subscriptionTableBar = new Subscription();
	loading$: Observable<boolean>;
	carts$: Observable<any>;
	disabledOrder: boolean = true;
	unSubcribeSubject$ = new Subject<void>();
	itemChecked: Array<any> = [];
	cartId: number = 0;
	totalItemChecked: number = 0;
	totalPriceChecked: number = 0;
	emptyCartUrl: string = '/assets/image/empty-cart.png';
	constructor(
		private globalQuery: GlobalQuery,
		private globalStore: GlobalStore,
		private router: Router,
		private cartService: CartService,
		private homeQuery: HomeQuery,
		private homeStore: HomeStore,
		@Inject(TuiTableBarsService)
		private tableBarsService: TuiTableBarsService,
		private authService: AuthService
	) {}

	ngOnInit(): void {
		this.fetchInit();
		this.initValue();
	}
	fetchInit() {
		if (this.authService.isLoggedIn()) {
			this.cartService.getAllCartItem().subscribe();
		} else {
			this.globalQuery
				.select('carts')
				.pipe(
					switchMap((data) => {
						return this.cartService.getCartItem(data);
					})
				)
				.subscribe();
		}
	}
	initValue() {
		this.carts$ = this.homeQuery.select('carts').pipe(
			map((data: Array<any>) => {
				if (data) {
					return data.map((item) => Object.assign({}, item));
				}
				return null;
			})
		);
	}
	onItemChange(item: any) {
		if (item.isChecked) {
			this.itemChecked.push(item);
		} else {
			this.itemChecked = this.itemChecked.filter((i) => i !== item);
		}
		this.calTotalPrice();
		if (this.itemChecked.length > 0) {
			this.disabledOrder = false;
		} else {
			this.disabledOrder = true;
		}
	}
	onQuantityChange(item: any) {
		this.calTotalPrice();
	}

	calTotalPrice() {
		var totalPrice = 0;
		var totalItem = 0;
		if (this.itemChecked.length > 0) {
			for (const item of this.itemChecked) {
				const total = item.productEntry.payPrice * item.quantity;
				totalPrice += total;
				totalItem += item.quantity;
			}
		} else {
			totalPrice = 0;
			totalItem = 0;
		}
		this.totalPriceChecked = totalPrice;
		this.totalItemChecked = totalItem;
	}
	showTableBar(id: number) {
		if (id) this.cartId = id;

		this.subscriptionTableBar = this.tableBarsService
			.open(this.tableBarTemplate || ``, {
				hasCloseButton: true,
			})
			.subscribe();
	}
	remove() {
		if (this.authService.isLoggedIn()) {
			this.cartService.deleteById(this.cartId).subscribe();
		} else {
			this.cartService.deleteCartItem(this.cartId);
		}
		this.subscriptionTableBar.unsubscribe();
	}
	onOrder() {
		if (this.itemChecked.length > 0) {
			this.globalStore.update((state) => ({
				itemChecked: this.itemChecked,
				totalItemChecked: this.totalItemChecked,
				totalPriceChecked: this.totalPriceChecked,
			}));
			this.router.navigate(['/checkout']);
		}
	}

	ngOnDestroy(): void {
		this.homeStore.reset();
		this.unSubcribeSubject$.next();
		this.unSubcribeSubject$.complete();
	}
}
