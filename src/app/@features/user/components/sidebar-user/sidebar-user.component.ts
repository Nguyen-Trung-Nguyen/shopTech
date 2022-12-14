import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GlobalQuery } from 'src/app/@core/state/global.query';

@Component({
	selector: 'app-sidebar-user',
	templateUrl: './sidebar-user.component.html',
	styleUrls: ['./sidebar-user.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarUserComponent implements OnInit, OnDestroy {
	user$: Observable<any>;
	unsubscribeSubject$ = new Subject<void>();
	items = [
		{
			name: 'Hồ sơ',
			link: '/user/profile',
		},
		{
			name: 'Địa chỉ',
			link: '/user/address',
		},
		{
			name: 'Đổi mật khẩu',
			link: '/user/password',
		},
	];
	constructor(private globalQuery: GlobalQuery) {}

	ngOnInit(): void {
		this.user$ = this.globalQuery.select('user');
	}

	ngOnDestroy(): void {
		this.unsubscribeSubject$.next();
		this.unsubscribeSubject$.complete();
	}
}
