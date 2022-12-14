import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TuiPreviewDialogService } from '@taiga-ui/addon-preview';
import { tuiIsPresent } from '@taiga-ui/cdk';
import { TuiDialogContext, TUI_NUMBER_FORMAT } from '@taiga-ui/core';
import { BehaviorSubject, filter, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { GlobalQuery } from 'src/app/@core/state/global.query';
import { GlobalStore } from 'src/app/@core/state/global.store';
import { AuthService } from 'src/app/@features/auth/state/auth.service';
import { CartService } from '../../service/cart.service';
import { HomeQuery } from '../../state/home.query';
import { HomeService } from '../../state/home.service';
import { HomeStore } from '../../state/home.store';
@Component({
	selector: 'app-product-detail-page',
	templateUrl: './product-detail-page.component.html',
	styleUrls: ['./product-detail-page.component.scss'],
	providers: [
		{
			provide: TUI_NUMBER_FORMAT,
			useValue: { decimalSeparator: `,`, thousandSeparator: `.` },
		},
	],
})
export class ProductDetailPageComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	productDetail$: Observable<any>;
	unSubcribeSubject$ = new Subject<void>();
	index = 0;
	listUrlImage: Array<any> = [];

	productDetailForm: FormGroup;
	cartSvg = '/assets/icon/cart.svg';
	disableButton: boolean = true;
	percent: number = 0;
	payPrice: number = 0;
	price: number = 0;
	stock: number = 0;
	outOfStockMessage = '';

	productEntry: any = null;

	colorSelected: any = {};
	capacitySelected: any = {};
	quantity: number = 1;
	product: any = null;
	productEntries: Array<any> = [];
	// for preview image
	@ViewChild('preview')
	readonly preview: TemplateRef<TuiDialogContext<void>>;
	readonly index$$ = new BehaviorSubject<number>(0);
	readonly item$ = this.index$$.pipe(
		map((index) => this.listUrlImage[index]),
		filter(tuiIsPresent)
	);
	readonly title$ = this.item$.pipe(map((item) => item.name));
	readonly imageSrc$ = this.item$.pipe(map((item) => item.url));
	constructor(
		private activatedRoute: ActivatedRoute,
		private homeStore: HomeStore,
		private homeService: HomeService,
		private homeQuery: HomeQuery,

		@Inject(TuiPreviewDialogService) private readonly previewService: TuiPreviewDialogService,
		private globalStore: GlobalStore,
		private globalQuery: GlobalQuery,
		private cartService: CartService,
		private authService: AuthService
	) {}

	ngOnInit(): void {
		window.scroll(0, 0);
		this.fetchInit();
		this.initValue();
		this.patchValue();
	}

	fetchInit() {
		this.activatedRoute.paramMap
			.pipe(
				switchMap((params) => {
					let slug = params.get('slug').toString();
					return this.homeService.findBySlug(slug);
				})
			)
			.subscribe();
	}
	initValue() {
		this.loading$ = this.homeQuery.selectLoading();
		this.productDetail$ = this.homeQuery.select('productDetail');
	}
	patchValue() {
		this.productDetail$
			.pipe(
				tap((data) => {
					if (data) {
						this.listUrlImage = data.images;
						this.productEntries = data.productEntries;
					}
				}),
				takeUntil(this.unSubcribeSubject$)
			)
			.subscribe();
	}

	onItemChange() {
		const colorName = this.colorSelected.name || '';
		const capacityName = this.capacitySelected.name || '';
		let productEntry: any = null;
		if (colorName && capacityName) {
			productEntry = this.productEntries.find(
				(p) => p.color.name === colorName && p.capacity.name === capacityName
			);
		} else if (colorName) {
			productEntry = this.productEntries.find((p) => p.color.name === colorName && !p.capacity);
		}
		if (productEntry) {
			this.handleProductEntry(productEntry);
		}
	}

	handleProductEntry(product: any) {
		this.productEntry = product;
		this.payPrice = product.payPrice;
		this.percent = product.percent;
		this.price = product.price;
		this.stock = product.stock;
		if (this.stock > 0) {
			this.outOfStockMessage = '';
			this.disableButton = false;
		}

		if (this.stock === 0 || this.stock < this.quantity) {
			this.outOfStockMessage = 'Sản phẩm bạn chọn đã hết hàng!';
			this.disableButton = true;
		}
	}

	addCart() {
		if (this.authService.isLoggedIn()) {
			const cartItem = {
				productEntryId: this.productEntry.id,
				quantity: this.quantity,
			};
			this.cartService.addCart(cartItem).subscribe();
		} else {
			const cartItem = {
				id: Math.floor(Math.random() * 1000) + 1,
				productEntryId: this.productEntry.id,
				quantity: this.quantity,
			};
			let arrayItem: Array<any> = [];
			this.globalQuery
				.select('carts')
				.pipe(
					tap((data) => {
						if (data) {
							arrayItem = data;
						}
					})
				)
				.subscribe();
			this.cartService.addCartItem(cartItem, arrayItem);
		}
		this.quantity = 1;
	}

	showPreview(index: number): void {
		this.index$$.next(index);
		this.previewService
			.open(this.preview || ``, {})
			.pipe(takeUntil(this.unSubcribeSubject$))
			.subscribe();
	}
	showInCarsouel(index: number) {
		this.index = index;
	}

	ngOnDestroy(): void {
		this.homeStore.reset();
		this.unSubcribeSubject$.next();
		this.unSubcribeSubject$.complete();
	}
}
