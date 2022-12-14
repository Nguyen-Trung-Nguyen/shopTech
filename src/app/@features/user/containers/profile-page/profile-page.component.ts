import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { validateRequired } from 'src/app/@shared/validators/custom-validator';
import { UserQuery } from '../../state/user.query';
import { UserService } from '../../state/user.service';
import { UserStore } from '../../state/user.store';
@Component({
	selector: 'app-profile-page',
	templateUrl: './profile-page.component.html',
	styleUrls: ['./profile-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnInit, OnDestroy {
	informationForm: FormGroup;
	updateAvatarForm: FormGroup;
	user$: Observable<any>;
	error$: Observable<HttpErrorResponse>;
	loading$: Observable<boolean>;
	items = ['Nam', 'Nữ', 'Khác'];
	avatarURL: any = '';
	unsubscribeSubject$ = new Subject<void>();

	constructor(
		private fb: FormBuilder,
		private userStore: UserStore,
		private userQuery: UserQuery,
		private userService: UserService,
		private sanitizer: DomSanitizer
	) {}

	ngOnInit(): void {
		this.initFom();
		this.userService.getProfile().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
		this.user$ = this.userQuery.user$;
		this.loading$ = this.userQuery.selectLoading();
		this.error$ = this.userQuery.error$;
		this.patchValue().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
		this.showPreviewAvatar().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
	}

	initFom() {
		this.informationForm = this.fb.group({
			fullname: ['', [validateRequired]],
			phonenumber: [''],
			gender: [''],
			birthdate: [''],
		});
		this.updateAvatarForm = this.fb.group({
			avatar: [null],
		});
	}
	patchValue() {
		return this.user$.pipe(
			tap((data) => {
				if (data) {
					if (data.avatar) {
						this.avatarURL = data.avatar.url;
					}
					this.informationForm.patchValue(data);
				}
			})
		);
	}

	showPreviewAvatar() {
		return this.updateAvatarForm.get('avatar').valueChanges.pipe(
			tap((file) => {
				if (file) {
					this.avatarURL = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
				}
			})
		);
	}

	updateAvatar() {
		this.userService
			.updateAvatar(this.updateAvatarForm.value.avatar)
			.pipe(takeUntil(this.unsubscribeSubject$))
			.subscribe();
		this.updateAvatarForm.patchValue({
			avatar: null,
		});
	}
	updateInformation() {
		this.userService
			.updateUserById(this.informationForm.value)
			.pipe(takeUntil(this.unsubscribeSubject$))
			.subscribe();
	}

	ngOnDestroy(): void {
		this.userStore.reset();
		this.unsubscribeSubject$.next();
		this.unsubscribeSubject$.complete();
	}
}
