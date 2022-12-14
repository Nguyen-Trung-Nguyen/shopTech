import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { AuthService } from 'src/app/@features/auth/state/auth.service';
import { DashboardQuery } from 'src/app/@features/dashboard/main/state/dashboard.query';
import { RoleAuthorisationService } from '../../service/role-authorisation.service';
import { GlobalQuery } from '../../state/global.query';
@Component({
	selector: 'app-menu-dashboard',
	templateUrl: './menu-dashboard.component.html',
	styleUrls: ['./menu-dashboard.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuDashboardComponent implements OnInit {
	open = false;
	userid: number = 0;
	user$: Observable<any>;
	logoSvg = '/assets/image/shoptech.jpg';
	unsubscribeSubject$ = new Subject<void>();
	constructor(
		private roleAuthorisationService: RoleAuthorisationService,
		private auth: AuthService,
		private cookieService: CookieService,
		private globalQuery: GlobalQuery,
		private dashboarQuery: DashboardQuery
	) {}

	ngOnInit(): void {
		this.userid = parseInt(this.cookieService.get('userid'));
		this.user$ = this.globalQuery.select('user');
	}

	isAdmin() {
		if (this.auth.isLoggedIn()) {
			if (this.roleAuthorisationService.isAdmin()) {
				return true;
			}
			return false;
		}

		return false;
	}

	toggle() {
		this.dashboarQuery.toggleSidebar();
	}

	isLoggedIn(): boolean {
		return this.auth.isLoggedIn();
	}
	logOut() {
		this.auth
			.logout()
			.pipe(
				tap((data) => {
					if (data) {
						location.href = '/auth/dang-nhap';
					}
				}),
				takeUntil(this.unsubscribeSubject$)
			)
			.subscribe();
	}
	ngOnDestroy() {
		this.unsubscribeSubject$.next();
		this.unsubscribeSubject$.complete();
	}
}
