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
import { Observable, Subject, Subscription, takeUntil, tap } from 'rxjs';
import { ColorQuery } from '../../state/color.query';
import { ColorService } from '../../state/color.service';
import { ColorStore } from '../../state/color.store';

@Component({
	selector: 'app-list-color-page',
	templateUrl: './list-color-page.component.html',
	styleUrls: ['./list-color-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListColorPageComponent implements OnInit, OnDestroy {
	@ViewChild(`tableBarTemplate`)
	tableBarTemplate: PolymorpheusContent = ``;
	colors$: Observable<any>;
	expandedAddform$: Observable<boolean>;
	loading$: Observable<boolean>;
	id: number = 0;
	subscriptionTableBar = new Subscription();
	unsubscribeSubject$ = new Subject();
	constructor(
		private service: ColorService,
		private query: ColorQuery,
		@Inject(TuiTableBarsService)
		private tableBarsService: TuiTableBarsService,
		private router: Router,
		private store: ColorStore
	) {}

	ngOnInit(): void {
		this.fetchInit();
		this.setValue();
	}
	fetchInit() {
		this.service.getAll().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
	}
	setValue() {
		this.colors$ = this.query.select('colors');
		this.expandedAddform$ = this.query.select('expanedAddForm');
		this.loading$ = this.query.selectLoading();
	}
	showAddForm() {
		this.query.toggleAddform();
	}
	popupTitle() {
		let title = 'Danh sách màu sắc';
		this.expandedAddform$
			.pipe(
				takeUntil(this.unsubscribeSubject$),
				tap((data) => {
					if (data) {
						title = 'Thêm màu sắc';
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
