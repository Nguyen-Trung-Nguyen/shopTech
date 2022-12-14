import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	OnDestroy,
	OnInit,
	ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TuiTableBarsService } from '@taiga-ui/addon-tablebars';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { ProductQuery } from '../../state/product.query';
import { ProductService } from '../../state/product.service';
import { ProductStore } from '../../state/product.store';
@Component({
	selector: 'app-list-product-page',
	templateUrl: './list-product-page.component.html',
	styleUrls: ['./list-product-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [],
})
export class ListProductPageComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	products$: Observable<any>;
	@ViewChild(`tableBarTemplate`)
	tableBarTemplate: PolymorpheusContent = ``;
	unSubscribeSubject$ = new Subject<void>();
	id: number = 0;
	subscriptionTableBar = new Subscription();
	readonly menuItems = [
		{ title: `View`, iconName: `tuiIconEyeOpen` },
		{ title: `Copy`, iconName: `tuiIconCopy` },
		{ title: `Delete`, iconName: `tuiIconTrash` },
		{ title: `Move`, iconName: `tuiIconFolder` },
	] as const;
	constructor(
		private store: ProductStore,
		private query: ProductQuery,
		private service: ProductService,
		private router: Router,
		@Inject(TuiTableBarsService)
		private tableBarsService: TuiTableBarsService
	) {}

	ngOnInit(): void {
		this.setValue();
	}
	printToConsole(title: any, item: any) {
		if (title === 'View') {
			let currentUrl = this.router.url;
			window.scroll(0, 0);
			this.router.navigate([currentUrl, item.slug]);
		}
		if (title === 'Delete') {
			this.id = item.id;
			this.subscriptionTableBar = this.tableBarsService
				.open(this.tableBarTemplate || ``, {
					hasCloseButton: true,
				})
				.subscribe();
		}
	}

	setValue() {
		this.loading$ = this.query.select('loading');
		this.products$ = this.query.select('products');
	}

	showTableBar(id: number) {
		if (id) this.id = id;
		this.subscriptionTableBar = this.tableBarsService
			.open(this.tableBarTemplate || ``, {
				hasCloseButton: true,
			})
			.subscribe();
	}
	remove() {
		this.service.deleteById(this.id).pipe(takeUntil(this.unSubscribeSubject$)).subscribe();
		this.subscriptionTableBar.unsubscribe();
	}

	ngOnDestroy(): void {
		this.store.update(state => ({
			products: null
		}))
		this.unSubscribeSubject$.next();
		this.unSubscribeSubject$.complete();
	}
}
