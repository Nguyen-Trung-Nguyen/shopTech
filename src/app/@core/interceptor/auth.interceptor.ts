import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
	HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from 'src/app/@features/auth/state/auth.service';
import { LocalStorageService } from '../service/local-storage.service';
const TOKEN_HEADER_KEY = 'Authorization';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	private isRefreshing = false;
	private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	constructor(private authService: AuthService, private localStorageService: LocalStorageService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
		let authReq = req;
		const token = this.localStorageService.getToken();
		if (token) {
			authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
		}
		return next.handle(authReq).pipe(
			catchError((error) => {
				if (
					error instanceof HttpErrorResponse &&
					error.status === 401 &&
					this.authService.isLoggedIn()
				) {
					return this.handle401Error(authReq, next);
				}
				return throwError(error);
			})
		);
	}
	private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
		if (!this.isRefreshing) {
			this.isRefreshing = true;
			this.refreshTokenSubject.next(null);

			return this.authService.refreshToken().pipe(
				switchMap((data: any) => {
					this.isRefreshing = false;
					this.localStorageService.saveToken(data.accessToken);
					return next.handle(this.attachTokenToRequest(request, data.accessToken));
				}),
				catchError((err) => {
					//refresh token is expired
					this.isRefreshing = false;
					return throwError(err);
				})
			);
		}

		return this.refreshTokenSubject.pipe(
			take(1),
			switchMap(() => next.handle(request))
		);
	}
	private attachTokenToRequest(request: HttpRequest<any>, token: string) {
		return request.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
			},
		});
	}
}

export const authInterceptorProviders = [
	{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
