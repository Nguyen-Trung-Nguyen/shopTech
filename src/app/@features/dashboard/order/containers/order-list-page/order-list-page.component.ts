import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TuiTableBarsService } from '@taiga-ui/addon-tablebars';
import { TUI_NUMBER_FORMAT } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Observable, Subject, Subscription } from 'rxjs';
import { OrderQuery } from '../../state/order.query';
import { OrderService } from '../../state/order.service';
import { OrderStore } from '../../state/order.store';
@Component({
	selector: 'app-order-list-page',
	templateUrl: './order-list-page.component.html',
	styleUrls: ['./order-list-page.component.scss'],
	providers: [
		{
			provide: TUI_NUMBER_FORMAT,
			useValue: { decimalSeparator: `,`, thousandSeparator: `.` },
		},
	],
})
export class OrderListPageComponent implements OnInit {
	loading$: Observable<boolean>;
	orders$: Observable<any>;
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
		private store: OrderStore,
		private query: OrderQuery,
		private service: OrderService,
		private router: Router,
		@Inject(TuiTableBarsService)
		private tableBarsService: TuiTableBarsService
	) {}

	ngOnInit(): void {
		this.setValue();
	}

	setValue() {
		this.orders$ = this.query.select('orders');
		this.loading$ = this.query.select('loading');
	}

	showTableBar(id: number) {
		if (id) this.id = id;
		this.subscriptionTableBar = this.tableBarsService
			.open(this.tableBarTemplate || ``, {
				hasCloseButton: true,
			})
			.subscribe();
	}
	printToConsole(title: any, item: any) {
		if (title === 'View') {
			let currentUrl = this.router.url;
			window.scroll(0, 0);
			this.router.navigate([currentUrl, item.id]);
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

	remove() {
		this.service.deleteById(this.id).subscribe();
		this.subscriptionTableBar.unsubscribe();
	}
	translateStatus(status: string) {
		if (status === 'PENDING') {
			return 'Ch??? x??c nh???n';
		}
		if (status === 'CONFIRMED') {
			return '???? x??c nh???n';
		}
		if (status === 'SHIPPING') {
			return '??ang v???n chuy???n';
		}
		if (status === 'COMPLETED') {
			return '???? giao';
		}
		if (status === 'CANCELLED') {
			return '???? h???y';
		}
		if (status === 'REFUND') {
			return 'Ho??n ti???n/Tr??? l???i';
		}
		return '';
	}

	ngOnDestroy(): void {
		this.store.update((state) => ({
			orders: null,
		}));
		this.unSubscribeSubject$.next();
		this.unSubscribeSubject$.complete();
	}
}
