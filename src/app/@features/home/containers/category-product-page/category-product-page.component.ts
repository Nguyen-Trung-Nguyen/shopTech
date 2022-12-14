import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TUI_NUMBER_FORMAT } from '@taiga-ui/core';
import { Observable, Subject, switchMap } from 'rxjs';
import { HomeQuery } from '../../state/home.query';
import { HomeService } from '../../state/home.service';
import { HomeStore } from '../../state/home.store';
@Component({
	selector: 'app-category-product-page',
	templateUrl: './category-product-page.component.html',
	styleUrls: ['./category-product-page.component.scss'],
	providers: [
		{
			provide: TUI_NUMBER_FORMAT,
			useValue: { decimalSeparator: `,`, thousandSeparator: `.` },
		},
	],
})
export class CategoryProductPageComponent implements OnInit, OnDestroy {
	@ViewChild('listproduct') listProductRef: ElementRef;
	loading$: Observable<boolean>;
	products$: Observable<any>;
	unSubcribeSubject$ = new Subject<void>();
	page: number = 0;
	slug: string = '';

	constructor(
		private activatedRoute: ActivatedRoute,
		private homeStore: HomeStore,
		private homeService: HomeService,
		private homeQuery: HomeQuery,
		private router: Router,
		private title: Title
	) {}

	ngOnInit(): void {
		this.fetchInit();
		this.initValue();
	}

	fetchInit() {
		this.activatedRoute.paramMap
			.pipe(
				switchMap((params) => {
					this.slug = params.get('category').toString();
					return this.homeService.getAllByCategory(this.slug, this.page);
				})
			)
			.subscribe();
	}

	initValue() {
		this.loading$ = this.homeQuery.select('loading');
		this.products$ = this.homeQuery.select('products');
	}

	ngOnDestroy(): void {
		this.homeStore.reset();
		this.unSubcribeSubject$.next();
		this.unSubcribeSubject$.complete();
	}
}
