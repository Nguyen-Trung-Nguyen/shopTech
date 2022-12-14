import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { DashboardUserState, DashboardUserStore } from './dashboard-user-store';
@Injectable({
	providedIn: 'root',
})
export class DashboardUserQuery extends Query<DashboardUserState> {
	constructor(protected store: DashboardUserStore) {
		super(store);
	}
}
