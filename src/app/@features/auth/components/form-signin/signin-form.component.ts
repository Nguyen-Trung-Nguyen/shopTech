import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { LocalStorageService } from 'src/app/@core/service/local-storage.service';
import { validateRequired } from 'src/app/@shared/validators/custom-validator';
import { environment } from 'src/environments/environment';
import { AuthQuery } from '../../state/auth.query';
import { AuthService } from '../../state/auth.service';
import { AuthStore } from '../../state/auth.store';

@Component({
	selector: 'app-form-signin',
	templateUrl: './signin-form.component.html',
	styleUrls: ['./signin-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninFormComponent implements OnInit {
	signinForm: FormGroup;
	loading$: Observable<boolean>;
	error$: Observable<HttpErrorResponse>;
	unsubscribeSubject$ = new Subject<void>();
	listSocialLogin = [
		{
			name: 'Google',
			url: environment.GOOGLE_AUTH_URL,
			iconUrl: '/assets/image/google.png',
			appearance: 'outline',
		},
		{
			name: 'Facebook',
			url: environment.FACEBOOK_AUTH_URL,
			iconUrl: '/assets/image/facebook.png',
			appearance: 'primary',
		},
	];
	constructor(
		private fb: FormBuilder,
		private authQuery: AuthQuery,
		private authService: AuthService,
		private router: Router,
		private store: AuthStore,
		private localStorageService: LocalStorageService
	) {
		this.formBuilderInit();
		this.error$ = this.authQuery.error$;
		this.loading$ = this.authQuery.selectLoading();
	}

	ngOnInit(): void {
		window.onbeforeunload = () => this.ngOnDestroy();
	}

	openWindow(item: any) {
		window.open(
			item.url,
			'_blank',
			'toolbar=yes,scrollbars=yes,resizable=yes,top=400,left=400,width=700,height=700'
		);
		this.localStorageService.removeItem('error');
		this.localStorageService.deleteAllToken();
		var error: any = null;
		const interval = setInterval(() => {
			error = JSON.parse(this.localStorageService.getItem('error'));
			if (error) {
				this.store.update((state) => ({
					error: error,
				}));
				clearInterval(interval);
			}
			if (this.localStorageService.getToken() && this.localStorageService.getRefreshToken()) {
				location.href = '/';
				clearInterval(interval);
			}
		}, 1000);
	}
	onSubmit() {
		const loginInfor = {
			email: this.signinForm.value.email,
			password: this.signinForm.value.password,
		};
		this.authService.login(loginInfor).pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
	}

	formBuilderInit(): void {
		this.signinForm = this.fb.group({
			email: ['', [validateRequired]],
			password: ['', [validateRequired]],
		});
	}

	ngOnDestroy(): void {
		this.store.reset();
		this.unsubscribeSubject$.next();
		this.unsubscribeSubject$.complete();
	}
}
