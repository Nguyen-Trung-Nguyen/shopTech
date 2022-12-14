import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { tap } from 'rxjs';
import { GlobalQuery } from '../state/global.query';
@Injectable({
	providedIn: 'root',
})
export class CheckoutGuard implements CanActivate {
	constructor(private globalQuery: GlobalQuery, private router: Router) {}
	canActivate(): boolean {
		let checkout = false;
		const obs = this.globalQuery.select('itemChecked');
		obs
			.pipe(
				tap((data) => {
					if (data.length > 0) {
						checkout = true;
					}
				})
			)
			.subscribe();
		if (checkout) {
			return true;
		}
		this.router.navigate(['/cart']);
		return false;
	}
}
