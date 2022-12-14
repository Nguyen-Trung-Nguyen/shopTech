import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/@features/auth/state/auth.service';
import { RoleAuthorisationService } from '../../service/role-authorisation.service';
import { GlobalQuery } from '../../state/global.query';
import { GlobalService } from '../../state/global.service';
@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit, OnDestroy {
	open = false;
	cartSvg = '/assets/image/cartitem.png';
	logoSvg = '/assets/image/shoptech.jpg';
	userid: number = 0;
	user$: Observable<any>;
	categories$: Observable<any>;
	unsubscribeSubject$ = new Subject<void>();
	totalItem$: Observable<number>;
	constructor(
		private roleAuthorisationService: RoleAuthorisationService,
		private auth: AuthService,
		private cookieService: CookieService,
		private globalQuery: GlobalQuery,
		private globalService: GlobalService
	) {}

	ngOnInit(): void {
		this.fetchInit();
		this.userid = parseInt(this.cookieService.get('userid'));
		this.user$ = this.globalQuery.select('user');
		this.categories$ = this.globalQuery.select('categories');
		this.totalItem$ = this.globalQuery.select('totalItem');
	}

	fetchInit() {
		this.globalService
			.getAllCat({
				name: 'Parent',
				value: 'parent',
			})

			.subscribe();
	}

	isAdmin() {
		if (this.roleAuthorisationService.isAdmin()) {
			return true;
		}
		return false;
	}
	isLoggedIn(): boolean {
		return this.auth.isLoggedIn();
	}
	logOut() {
		this.auth.logout().subscribe();
	}
	ngOnDestroy() {
		this.unsubscribeSubject$.next();
		this.unsubscribeSubject$.complete();
	}
}
