import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MessageResponse } from 'src/app/@shared/models/message-response.model';
import { validateRequired } from 'src/app/@shared/validators/custom-validator';
import {
	ConfirmedValidator,
	passwordValidator,
} from 'src/app/@shared/validators/password-strength.validator';
import { AuthQuery } from '../../state/auth.query';
import { AuthService } from '../../state/auth.service';
import { AuthStore } from '../../state/auth.store';
@Component({
	selector: 'app-form-signup',
	templateUrl: './form_signup.component.html',
	styleUrls: ['./form_signup.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSignUpComponent implements OnInit {
	messageResponse$: Observable<MessageResponse>;
	loading$: Observable<boolean>;
	error$: Observable<HttpErrorResponse>;
	regisForm: FormGroup;
	unsubscribeSubject$ = new Subject<void>();
	constructor(
		private formbuilder: FormBuilder,
		private authQuery: AuthQuery,
		private authService: AuthService,
		private store: AuthStore
	) {}

	ngOnInit(): void {
		this.formBuilderInit();
		this.messageResponse$ = this.authQuery.messageResponse$;
		this.loading$ = this.authQuery.selectLoading();
		this.error$ = this.authQuery.error$;
	}
	onSubmit() {
		const user = {
			fullName: this.regisForm.value.fullname.trim(),
			email: this.regisForm.value.email,
			password: this.regisForm.value.password,
		};
		this.authService.signup(user).pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
	}
	private formBuilderInit(): void {
		this.regisForm = this.formbuilder.group(
			{
				fullname: ['', [validateRequired, Validators.minLength(6), Validators.maxLength(50)]],
				email: ['', [validateRequired, , Validators.email]],
				password: [
					'',
					[passwordValidator, validateRequired, Validators.minLength(6), Validators.maxLength(32)],
				],
				confirmPassword: [
					'',
					[passwordValidator, validateRequired, Validators.minLength(6), Validators.maxLength(32)],
				],
			},
			{
				validator: ConfirmedValidator('password', 'confirmPassword'),
			}
		);
	}
	ngOnDestroy(): void {
		this.store.reset();
		this.unsubscribeSubject$.next();
		this.unsubscribeSubject$.complete();
	}
}
