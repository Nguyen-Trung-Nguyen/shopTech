import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of, startWith, switchMap } from 'rxjs';
import { HomeQuery } from 'src/app/@features/home/state/home.query';
import { NotificationService } from '../../service/notification.service';
import { GlobalQuery } from '../../state/global.query';

@Component({
	selector: 'app-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
	isShowNotifi = false;
	notifications$: Observable<any>;
	user$: Observable<any>;
	filterArray: any = [
		{
			name: 'Tất cả',
			value: '',
		},
		{
			name: 'Chưa đọc',
			value: 'false',
		},
	];
	filter = new FormControl('');
	constructor(
		private globalQuery: GlobalQuery,
		private notificationService: NotificationService,
		private homeQuery: HomeQuery
	) {}

	ngOnInit(): void {
		this.user$ = this.globalQuery.select('user');
		this.notifications$ = this.homeQuery.select('notifications');
		this.onFilterChanges();
	}

	initValue() {
		this.filter.setValue(this.filterArray[0]);
	}
	onFilterChanges() {
		this.filter.valueChanges
			.pipe(
				startWith(this.filter.value),
				switchMap((data: any) => {
					if (data) {
						return this.notificationService.getAllByUserId(data.value);
					}
					return of();
				})
			)
			.subscribe();
	}
	showNotification() {
		this.isShowNotifi = !this.isShowNotifi;
		this.initValue();
	}
	onActiveZone(active: boolean): void {
		this.isShowNotifi = active && this.isShowNotifi;
	}

	onItemNotification(item: any) {
		if (!item.isread) {
			this.notificationService
				.setIsRead(item.id)
				.pipe(
					switchMap(() => {
						return this.notificationService.updateTotalNoti();
					})
				)
				.subscribe();
		}
	}

	onDelete(event: any, id: number) {
		event.preventDefault();
		event.stopPropagation();
		this.notificationService.deleteByid(id).subscribe();
	}
}
