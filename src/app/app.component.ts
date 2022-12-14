import { Component, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { filter, map, Observable } from 'rxjs';
import { LocalStorageService } from './@core/service/local-storage.service';
import { NotificationService } from './@core/service/notification.service';
import { RoleAuthorisationService } from './@core/service/role-authorisation.service';
import { StompService } from './@core/service/stomp.service';
import { GlobalQuery } from './@core/state/global.query';
import { AuthService } from './@features/auth/state/auth.service';
import { UserService } from './@features/user/state/user.service';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	user$: Observable<any>;
	constructor(
		private router: Router,
		private authService: AuthService,
		private activedRoute: ActivatedRoute,
		private notificationService: NotificationService,
		private title: Title,
		private stompService: StompService,
		private roleService: RoleAuthorisationService,
		private userService: UserService,
		private globalQuery: GlobalQuery,
		private localStorageService: LocalStorageService,
		@Inject(TuiAlertService)
		private readonly alertService: TuiAlertService
	) {}

	ngOnInit(): void {
		this.user$ = this.globalQuery.select('user');
		this.setDynamicTitle();
		this.subcribeSocket();
		this.fetchBasicInfor();
		this.checkRefreshToken();
	}

	subcribeSocket() {
		setTimeout(() => {
			if (this.roleService.isAdmin()) {
				this.stompService.subscribe('/topic/new-order', (data: any) => {
					this.alertService
						.open('Bạn vừa có một đơn hàng mới!', {
							label: 'New Order',
							status: TuiNotification.Success,
							autoClose: true,
						})
						.subscribe();
					this.notificationService.updateTotalNoti().subscribe();
				});
			}
		}, 1000);
	}
	fetchBasicInfor() {
		if (this.authService.isLoggedIn()) {
			this.userService.getBasicInfor().subscribe();
		}
	}
	checkRefreshToken() {
		if (this.authService.isLoggedIn()) {
			setInterval(() => {
				if (!this.localStorageService.getRefreshToken()) {
					this.authService.logout().subscribe();
				} else {
					return;
				}
			}, 2500);
		}
	}
	setDynamicTitle() {
		const appTitle = this.title.getTitle();
		this.router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				map(() => {
					let child = this.activedRoute.firstChild;
					while (child.firstChild) {
						child = child.firstChild;
					}
					if (child.snapshot.data['title']) {
						return child.snapshot.data['title'];
					}
					return appTitle;
				})
			)
			.subscribe((ttl: string) => {
				this.title.setTitle(ttl);
			});
	}
}
