import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { GlobalQuery } from '../state/global.query';
import { LocalStorageService } from './local-storage.service';
const ROLE_ADMIN = 'ROLE_ADMIN';
const ROLE_USER = 'ROLE_USER';

@Injectable({
	providedIn: 'root',
})
export class RoleAuthorisationService {
	user: any = null;
	constructor(private localStorage: LocalStorageService, private globalQuery: GlobalQuery) {
		this.globalQuery
			.select('user')
			.pipe(
				tap((data) => {
					if (data) {
						this.user = data;
					}
				})
			)
			.subscribe();
	}

	public isAdmin(): boolean {
		if (this.user) {
			const roles: string[] = this.user.roles;
			if (roles.includes(ROLE_ADMIN)) {
				return true;
			}
			return false;
		}

		return false;
	}
	public getUserId() {
		var userId = 0;
		if (this.user) {
			userId = this.user.id;
		}
		return userId;
	}
	// public isUser(): boolean {
	// 	this.user = this.localStorage.getUser();
	// 	if (this.user === null || this.user === undefined) {
	// 		return false;
	// 	}
	// 	const roles: string[] = this.user.roles;
	// 	if (roles.includes(ROLE_USER)) {
	// 		return true;
	// 	}
	// 	return false;
	// }
}
