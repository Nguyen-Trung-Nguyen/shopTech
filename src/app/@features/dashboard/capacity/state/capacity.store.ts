import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig } from '@datorama/akita';

export interface CapacityState {
	capacities: any;
	capacity: any;
	error: HttpErrorResponse;
	expanedAddForm: boolean;
}
const initialState: CapacityState = {
	capacities: null,
	capacity: null,
	error: null,
	expanedAddForm: false,
};

@Injectable({
	providedIn: 'root',
})
@StoreConfig({
	name: 'capacity',
	resettable: true,
})
export class CapacityStore extends EntityStore<CapacityState> {
	constructor() {
		super(initialState);
	}
}
