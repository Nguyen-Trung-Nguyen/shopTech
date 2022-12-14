import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TuiTableBarsService } from '@taiga-ui/addon-tablebars';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Observable, Subject, Subscription } from 'rxjs';
import { DashboardUserStore } from '../../state/dashboard-user-store';
import { DashboardUserQuery } from '../../state/dashboard-user.query';
import { DashboardUserService } from '../../state/dashboard-user.service';

@Component({
	selector: 'app-user-list-page',
	templateUrl: './user-list-page.component.html',
	styleUrls: ['./user-list-page.component.scss'],
})
export class UserListPageComponent implements OnInit {
	loading$: Observable<boolean>;
	users$: Observable<any>;
	@ViewChild(`tableBarTemplate`)
	tableBarTemplate: PolymorpheusContent = ``;
	unSubscribeSubject$ = new Subject<void>();
	id: number = 0;
	subscriptionTableBar = new Subscription();

	readonly menuItems = [
		{ title: `View`, iconName: `tuiIconEyeOpen` },
		{ title: `Copy`, iconName: `tuiIconCopy` },
		{ title: `Delete`, iconName: `tuiIconTrash` },
		{ title: `Move`, iconName: `tuiIconFolder` },
	] as const;
	constructor(
		private store: DashboardUserStore,
		private query: DashboardUserQuery,
		private service: DashboardUserService,
		private router: Router,
		@Inject(TuiTableBarsService)
		private tableBarsService: TuiTableBarsService
	) {}

	ngOnInit(): void {
		this.fetchInit();
		this.setValue();
	}

	translateRole(name: string) {
		let role = name.substring(5);
		return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
	}
	fetchInit() {
		this.service.getAll().subscribe();
	}

	setValue() {
		this.users$ = this.query.select('users');
		this.loading$ = this.query.select('loading');
	}

	showTableBar(id: number) {
		if (id) this.id = id;
		this.subscriptionTableBar = this.tableBarsService
			.open(this.tableBarTemplate || ``, {
				hasCloseButton: true,
			})
			.subscribe();
	}
	printToConsole(title: any, item: any) {
		if (title === 'View') {
			let currentUrl = this.router.url;
			window.scroll(0, 0);
			this.router.navigate([currentUrl, item.id]);
		}
		if (title === 'Delete') {
			this.id = item.id;
			this.subscriptionTableBar = this.tableBarsService
				.open(this.tableBarTemplate || ``, {
					hasCloseButton: true,
				})
				.subscribe();
		}
	}

	remove() {
		// this.service.deleteById(this.id).subscribe();
		this.subscriptionTableBar.unsubscribe();
	}
	

	ngOnDestroy(): void {
		this.store.reset();
		this.unSubscribeSubject$.next();
		this.unSubscribeSubject$.complete();
	}
}
