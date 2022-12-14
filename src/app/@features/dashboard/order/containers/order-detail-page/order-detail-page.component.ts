import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TUI_NUMBER_FORMAT } from '@taiga-ui/core';
import { Observable, switchMap, tap } from 'rxjs';
import { OrderQuery } from '../../state/order.query';
import { OrderService } from '../../state/order.service';
import { OrderStore } from '../../state/order.store';
@Component({
	selector: 'app-order-detail-page',
	templateUrl: './order-detail-page.component.html',
	styleUrls: ['./order-detail-page.component.scss'],
	providers: [
		{
			provide: TUI_NUMBER_FORMAT,
			useValue: { decimalSeparator: `,`, thousandSeparator: `.` },
		},
	],
})
export class OrderDetailPageComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	order$: Observable<any>;
	editForm: FormGroup;
	statusList: Array<any> = [
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
	status: any = null;
	id: number = 0;
	constructor(
		private fb: FormBuilder,
		private orderService: OrderService,
		private orderQuery: OrderQuery,
		private orderStore: OrderStore,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.fetchInit();
		this.initValue();
		this.patchValue();
	}

	initForm() {}
	fetchInit() {
		this.activatedRoute.paramMap
			.pipe(
				switchMap((params) => {
					let id = parseInt(params.get('id'));
					this.id = id;
					return this.orderService.findById(id);
				})
			)
			.subscribe();
	}
	initValue() {
		this.order$ = this.orderQuery.select('order');
		this.loading$ = this.orderQuery.select('loading');
	}

	patchValue() {
		this.order$
			.pipe(
				tap((data) => {
					if (data) {
						const statusValue = data.status;
						this.status = this.statusList.find((s) => s.value === statusValue);
					}
				})
			)
			.subscribe();
	}
	update() {
		const request = {
			status: this.status.value,
		};
		this.orderService.updateById(this.id, request).subscribe();
	}
	ngOnDestroy(): void {
		this.orderStore.update((state) => ({
			order: null,
		}));
	}
}
