import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TuiTableBarsService } from '@taiga-ui/addon-tablebars';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Observable, Subject, Subscription, takeUntil, tap } from 'rxjs';
import { CapacityQuery } from '../../state/capacity.query';
import { CapacityService } from '../../state/capacity.service';
import { CapacityStore } from '../../state/capacity.store';

@Component({
	selector: 'app-list-capacity-page',
	templateUrl: './list-capacity-page.component.html',
	styleUrls: ['./list-capacity-page.component.scss'],
})
export class ListCapacityPageComponent implements OnInit, OnDestroy {
	@ViewChild(`tableBarTemplate`)
	tableBarTemplate: PolymorpheusContent = ``;
	capacities$: Observable<any>;
	expandedAddform$: Observable<boolean>;
	loading$: Observable<boolean>;
	id: number = 0;
	subscriptionTableBar = new Subscription();
	unsubscribeSubject$ = new Subject();
	constructor(
		private service: CapacityService,
		private query: CapacityQuery,
		@Inject(TuiTableBarsService)
		private tableBarsService: TuiTableBarsService,
		private router: Router,
		private store: CapacityStore
	) {}

	ngOnInit(): void {
		this.fetchInit();
		this.setValue();
	}
	fetchInit() {
		this.service.getAll().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
	}
	setValue() {
		this.capacities$ = this.query.select('capacities');
		this.expandedAddform$ = this.query.select('expanedAddForm');
		this.loading$ = this.query.selectLoading();
	}
	showAddForm() {
		this.query.toggleAddform();
	}
	popupTitle() {
		let title = 'Danh sách bộ nhớ trong';
		this.expandedAddform$
			.pipe(
				takeUntil(this.unsubscribeSubject$),
				tap((data) => {
					if (data) {
						title = 'Thêm bộ nhớ trong';
					}
				})
			)
			.subscribe();

		return title;
	}

	remove() {
		this.service.deleteById(this.id).pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
		this.subscriptionTableBar.unsubscribe();
	}
	showTableBar(id: number) {
		if (id) this.id = id;
		this.subscriptionTableBar = this.tableBarsService
			.open(this.tableBarTemplate || ``, {
				hasCloseButton: true,
			})
			.subscribe();
	}

	goToEditPage(id: number) {
		let currentUrl = this.router.url;
		window.scroll(0, 0);
		this.router.navigate([currentUrl, id]);
	}
	ngOnDestroy(): void {
		this.store.reset();
		this.unsubscribeSubject$.next(0);
		this.unsubscribeSubject$.unsubscribe();
	}
}
