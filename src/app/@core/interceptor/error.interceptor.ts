import {
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
	HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/@features/auth/state/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(private authService: AuthService, private router: Router) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			catchError((err) => {
				if ([403].indexOf(err.status) !== -1 && this.authService.isLoggedIn()) {
					this.authService.logout().subscribe();
				}
				if ([404].indexOf(err.status) !== -1) {
					this.router.navigateByUrl('/404', {
						skipLocationChange: true,
					});
				}

				return throwError(err);
			})
		);
	}
}
export const errorInterceptorProviders = [
	{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
];
