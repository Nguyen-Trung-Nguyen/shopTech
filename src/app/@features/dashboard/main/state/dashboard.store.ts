import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig } from '@datorama/akita';

export interface DashboardState {
	expanedSidebar: boolean;
}
const initialState: DashboardState = {
	expanedSidebar: true,
};

@Injectable({
	providedIn: 'root',
})
@StoreConfig({
	name: 'dashboard',
	resettable: true,
})
export class DashboardStore extends EntityStore<DashboardState> {
	constructor() {
		super(initialState);
	}
}
