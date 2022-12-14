import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { CapacityQuery } from '../../capacity/state/capacity.query';
import { CapacityService } from '../../capacity/state/capacity.service';
import { CategoryQuery } from '../../category/state/category.query';
import { CategoryService } from '../../category/state/category.service';
import { ColorQuery } from '../../color/state/color.query';
import { ColorService } from '../../color/state/color.service';
import { ProductState, ProductStore } from './product.store';
@Injectable({
	providedIn: 'root',
})
export class ProductQuery extends Query<ProductState> {
	constructor(
		protected store: ProductStore,
		private colorQuery: ColorQuery,
		private colorService: ColorService,
		private categoryQuery: CategoryQuery,
		private categoryService: CategoryService,
		private capacityQuery: CapacityQuery,
		private capacityService: CapacityService
	) {
		super(store);
	}
	getColors() {
		this.colorService.getAll().subscribe();
		return this.colorQuery.select('colors');
	}
	getCategories() {
		this.categoryService.getAll({}).subscribe();
		return this.categoryQuery.select('categories');
	}

	getCapacities() {
		this.capacityService.getAll().subscribe();
		return this.capacityQuery.select('capacities');
	}
}
