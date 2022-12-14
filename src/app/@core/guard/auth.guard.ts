import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthService } from 'src/app/@features/auth/state/auth.service';


@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanLoad {
	constructor(private authService: AuthService, private router: Router) {}
	canLoad(): boolean {
		if (this.authService.isLoggedIn()) {
			this.router.navigate(['/']);
			return false;
		}
		return true;
	}
}
