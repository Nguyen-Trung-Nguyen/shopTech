import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import { LocalStorageService } from 'src/app/@core/service/local-storage.service';
import { AuthStore } from '../../state/auth.store';
@Component({
	selector: 'app-oauth2-redirect-page',
	templateUrl: './oauth2-redirect-page.component.html',
	styleUrls: ['./oauth2-redirect-page.component.scss'],
})
export class Oauth2RedirectPageComponent implements OnInit, OnDestroy {
	
	constructor(
		private route: ActivatedRoute,
		private localStorage: LocalStorageService,
		private store: AuthStore,
		private router: Router
	) {}

	ngOnInit(): void {
		this.fetchInit();
	}

	fetchInit() {
		this.route.queryParams
			.pipe(
				tap((params) => {
					if (params) {
						if (params.error) {
							const error: any = {
								message: params.error,
							};
							this.localStorage.setItem('error', JSON.stringify(error));
						} else {
							const accessToken = params.accessToken;
							const refreshToken = params.refreshToken;
							this.localStorage.saveToken(accessToken);
							this.localStorage.saveRefreshToken(refreshToken);
						}

						window.close();
					}
				})
			)
			.subscribe();
	}

	ngOnDestroy() {}
}
