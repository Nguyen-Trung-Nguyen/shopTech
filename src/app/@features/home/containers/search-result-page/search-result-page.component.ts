import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, switchMap } from 'rxjs';
import { HomeQuery } from '../../state/home.query';
import { HomeService } from '../../state/home.service';
import { HomeStore } from '../../state/home.store';
@Component({
	selector: 'app-search-result-page',
	templateUrl: './search-result-page.component.html',
	styleUrls: ['./search-result-page.component.scss'],
})
export class SearchResultPageComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	products$: Observable<any>;
	unSubcribeSubject$ = new Subject<void>();
	keyword: string = '';
	constructor(
		private activatedRoute: ActivatedRoute,
		private homeStore: HomeStore,
		private homeService: HomeService,
		private homeQuery: HomeQuery,
		private router: Router
	) {}

	ngOnInit(): void {
		this.fetchInit();
		this.initValue();
	}
	fetchInit() {
		this.activatedRoute.queryParams
			.pipe(
				switchMap((params) => {
					const keyword = params['keyword'];
					this.keyword = keyword;
					return this.homeService.searchResult(keyword, 0, 30);
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
