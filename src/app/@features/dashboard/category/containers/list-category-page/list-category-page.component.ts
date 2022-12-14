import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	OnDestroy,
	OnInit,
	ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiTableBarsService } from '@taiga-ui/addon-tablebars';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Observable, Subject, Subscription, takeUntil, tap } from 'rxjs';
import { CategoryQuery } from '../../state/category.query';
import { CategoryService } from '../../state/category.service';
import { CategoryStore } from '../../state/category.store';
@Component({
	selector: 'app-list-category-page',
	templateUrl: './list-category-page.component.html',
	styleUrls: ['./list-category-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListCategoryPageComponent implements OnInit, OnDestroy {
	@ViewChild(`tableBarTemplate`)
	tableBarTemplate: PolymorpheusContent = ``;
	categories$: Observable<any>;
	expandedAddform$: Observable<boolean>;
	optionFilter: Array<any> = [
		{
			name: 'Parent',
			value: 'parent',
		},
		{
			name: 'Children',
			value: 'children',
		},
	];
	filter = new FormControl(this.optionFilter[0]);
	loading$: Observable<boolean>;
	id: number = 0;
	subscriptionTableBar = new Subscription();
	unsubscribeSubject$ = new Subject();
	constructor(
		private service: CategoryService,
		private query: CategoryQuery,
		@Inject(TuiTableBarsService)
		private tableBarsService: TuiTableBarsService,
		private router: Router,
		private store: CategoryStore
	) {}

	ngOnInit(): void {
		this.fetchInit();
		this.setValue();
		this.onFilter().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
	}
	fetchInit() {
		this.service.getAll(this.optionFilter[0]).pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
	}
	setValue() {
		this.categories$ = this.query.select('categories');
		this.expandedAddform$ = this.query.select('expanedAddForm');
		this.loading$ = this.query.selectLoading();
	}
	showAddForm() {
		this.query.toggleAddform();
	}
	popupTitle() {
		let title = 'Danh sách danh mục';
		this.expandedAddform$
			.pipe(
				takeUntil(this.unsubscribeSubject$),
				tap((data) => {
					if (data) {
						title = 'Thêm danh mục';
					}
				})
			)
			.subscribe();

		return title;
	}

	onFilter() {
		return this.filter.valueChanges.pipe(
			tap((data) => {
				if (data.value === 'parent') {
					this.service
						.getAll(this.optionFilter[0])
						.pipe(takeUntil(this.unsubscribeSubject$))
						.subscribe();
				} else {
					this.service
						.getAll(this.optionFilter[1])
						.pipe(takeUntil(this.unsubscribeSubject$))
						.subscribe();
				}
			})
		);
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
