import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { DashboardState, DashboardStore } from './dashboard.store';
@Injectable({
	providedIn: 'root',
})
export class DashboardQuery extends QueryEntity<DashboardState> {
	constructor(protected store: DashboardStore) {
		super(store);
	}

	toggleSidebar() {
		this.store.update((state) => ({
			expanedSidebar: !state.expanedSidebar,
		}));
	}
}
