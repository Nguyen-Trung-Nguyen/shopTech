import { Component, OnInit } from '@angular/core';
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
import { OrderQuery } from '../../state/order.query';
import { OrderService } from '../../state/order.service';
import { OrderStore } from '../../state/order.store';
@Component({
	selector: 'app-filter-order',
	templateUrl: './filter-order.component.html',
	styleUrls: ['./filter-order.component.scss'],
})
export class FilterOrderComponent implements OnInit {
	statusList: Array<any> = [
		{
			name: 'Tất cả',
			value: '',
		},
		{
			name: 'Chờ xác nhận',
			value: 'PENDING',
		},
		{
			name: 'Đã xác nhận',
			value: 'CONFIRMED',
		},
		{
			name: 'Đang vận chuyển',
			value: 'SHIPPING',
		},
		{
			name: 'Đã giao',
			value: 'COMPLETED',
		},
		{ name: 'Đã hủy', value: 'CANCELLED' },
		{ name: 'Hoàn tiền/Trả lại', value: 'REFUND' },
	];
	unsubscribeSubject$ = new Subject();
	status = new FormControl('');
	search = new FormControl('');
	content: string = '';
	searchResult$: Observable<any>;
	statusFilter: any = null;
	constructor(
		private orderQuery: OrderQuery,
		private orderStore: OrderStore,
		private orderService: OrderService
	) {}

	ngOnInit(): void {
		this.searchResult$ = this.orderQuery.select('searchResult');
		this.initValue();
		this.statusChanges();
		this.searchChanges();
	}

	initValue() {
		this.status.setValue(this.statusList[0]);
		this.orderQuery
			.select('statusFilter')
			.pipe(
				tap((data) => {
					if (data) {
						this.status.setValue(data);
					}
				})
			)
			.subscribe();
	}
	searchChanges() {
		this.search.valueChanges
			.pipe(
				debounceTime(500),
				distinctUntilChanged(),
				switchMap((data) => {
					return this.orderService.search(data);
				})
			)
			.subscribe();
	}
	statusChanges() {
		this.status.valueChanges
			.pipe(
				startWith(this.status.value),
				switchMap((data: any) => {
					if (data) {
						this.orderStore.update((state) => ({
							statusFilter: data,
						}));
						return this.orderService.filter(data.value);
					}
					return of();
				}),
				takeUntil(this.unsubscribeSubject$)
			)
			.subscribe();
	}
	filterStatus(data: any) {}
	translateStatus(status: string) {
		if (status === 'PENDING') {
			return 'Chờ xác nhận';
		}
		if (status === 'CONFIRMED') {
			return 'Đã xác nhận';
		}
		if (status === 'SHIPPING') {
			return 'Đang vận chuyển';
		}
		if (status === 'COMPLETED') {
			return 'Đã giao';
		}
		if (status === 'CANCELLED') {
			return 'Đã hủy';
		}
		if (status === 'REFUND') {
			return 'Hoàn tiền/Trả lại';
		}
		return '';
	}
	ngOnDestroy(): void {
		this.unsubscribeSubject$.next(0);
		this.unsubscribeSubject$.unsubscribe();
	}
}
