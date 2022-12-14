import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthService } from 'src/app/@features/auth/state/auth.service';
import { RoleAuthorisationService } from '../service/role-authorisation.service';

@Injectable({
	providedIn: 'root',
})
export class AuthAdminGuard implements CanLoad {
	constructor(
		private authService: AuthService,
		private router: Router,
		private roleAuthorisationService: RoleAuthorisationService
	) {}
	canLoad(): boolean {
		if (this.authService.isLoggedIn()) {
			if (this.roleAuthorisationService.isAdmin()) {
				return true;
			}
			this.router.navigate(['/']);
			return false;
		}
		this.router.navigate(['/auth/dang-nhap']);
		return false;
	}
}
