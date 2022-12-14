import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
	debounceTime,
	distinctUntilChanged,
	Observable,
	of,
	startWith,
	Subject,
	switchMap,
	takeUntil,
	tap,
} from 'rxjs';
import { removeSpecialChar, stringToSlug } from 'src/app/@shared/utils/string.utils';
import { CategoryQuery } from '../../../category/state/category.query';
import { CategoryService } from '../../../category/state/category.service';
import { CategoryStore } from '../../../category/state/category.store';
import { ProductQuery } from '../../state/product.query';
import { ProductService } from '../../state/product.service';
import { ProductStore } from '../../state/product.store';

@Component({
	selector: 'app-filter-list-product',
	templateUrl: './filter-list-product.component.html',
	styleUrls: ['./filter-list-product.component.scss'],
})
export class FilterListProductComponent implements OnInit, OnDestroy {
	optionFilter: Array<any> = [];
	unsubscribeSubject$ = new Subject();
	filter = new FormControl(null);
	search = new FormControl('');
	categories$: Observable<any>;
	content: string = '';
	searchResult$: Observable<any>;
	constructor(
		private categoryService: CategoryService,
		private categoryQuery: CategoryQuery,
		private categorystore: CategoryStore,
		private productService: ProductService,
		private productQuery: ProductQuery,
		private productStore: ProductStore
	) {}

	ngOnInit(): void {
		this.categories$ = this.categoryQuery.select('categories');
		this.searchResult$ = this.productQuery.select('searchResult');
		this.fetchInit();
		this.valueChanges();
	}

	patchValue() {
		return this.categories$.pipe(
			tap((data) => {
				if (data) {
					const subcategories = data[0].subcategories;
					this.filter.setValue(subcategories[0]);
				}
			})
		);
	}
	fetchInit() {
		this.categoryService
			.getAll({ name: 'Parent', value: 'parent' })
			.pipe(takeUntil(this.unsubscribeSubject$))
			.subscribe();
		this.productQuery
			.select('filterOption')
			.pipe(
				switchMap((data) => {
					if (data) {
						this.filter.setValue(data);
						return of();
					} else {
						return this.patchValue();
					}
				})
			)
			.subscribe();
	}

	valueChanges() {
		this.filter.valueChanges
			.pipe(
				startWith(this.filter.value),
				switchMap((data) => {
					if (data) {
						this.productStore.update((state) => ({
							filterOption: data,
						}));
						return this.productService.getAllByCategory(data.slug);
					} else {
						return of();
					}
				})
			)
			.subscribe();
		this.search.valueChanges
			.pipe(
				debounceTime(500),
				distinctUntilChanged(),
				switchMap((data) => {
					const value = data;
					const noSpecicalChar = removeSpecialChar(value);
					const keyword = stringToSlug(noSpecicalChar);
					return this.productService.search(keyword);
				})
			)
			.subscribe();
	}

	ngOnDestroy(): void {
		this.categorystore.reset();
		this.unsubscribeSubject$.next(0);
		this.unsubscribeSubject$.unsubscribe();
	}
}
