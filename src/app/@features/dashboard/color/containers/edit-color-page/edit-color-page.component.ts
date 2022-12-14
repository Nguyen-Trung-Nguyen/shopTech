import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { defaultEditorColors } from '@taiga-ui/addon-editor';
import { Observable, skip, Subject, takeUntil, tap } from 'rxjs';
import {
	validateRequired,
	validateSpecialChacracter,
} from 'src/app/@shared/validators/custom-validator';
import { ColorQuery } from '../../state/color.query';
import { ColorService } from '../../state/color.service';
import { ColorStore } from '../../state/color.store';

@Component({
	selector: 'app-edit-color-page',
	templateUrl: './edit-color-page.component.html',
	styleUrls: ['./edit-color-page.component.scss'],
})
export class EditColorPageComponent implements OnInit, OnDestroy {
	editForm: FormGroup;
	color$: Observable<any>;
	unsubscribeSubject$ = new Subject<void>();
	id: number;
	initialValueForm: any = null;
	hasChange = true;
	loading$: Observable<boolean>;
	readonly palette = defaultEditorColors;
	constructor(
		private activatedRoute: ActivatedRoute,
		private fb: FormBuilder,
		private router: Router,
		private service: ColorService,
		private query: ColorQuery,
		private store: ColorStore
	) {}

	ngOnInit(): void {
		this.initFom();
		this.fetchInit();
		this.setValue();
		this.checkFormChange();
	}

	fetchInit() {
		this.getById().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
	}
	setValue() {
		this.color$ = this.query.select('color');
		this.loading$ = this.query.selectLoading();
		this.patchValue().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
	}
	initFom() {
		this.editForm = this.fb.group({
			name: ['', [validateRequired, Validators.maxLength(20), validateSpecialChacracter]],
			hex: [''],
		});
	}
	getById() {
		return this.activatedRoute.paramMap.pipe(
			tap((params) => {
				if (params) {
					this.id = parseInt(params.get('id'));
					this.service.findById(this.id).pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
				}
			})
		);
	}
	patchValue() {
		return this.color$.pipe(
			tap((data) => {
				if (data) {
					this.editForm.patchValue(data);
					this.initialValueForm = this.editForm.value;
				}
			})
		);
	}

	checkFormChange() {
		this.editForm.valueChanges
			.pipe(skip(1), takeUntil(this.unsubscribeSubject$))
			.subscribe((value) => {
				if (value) {
					if (
						Object.entries(this.initialValueForm).toString() === Object.entries(value).toString()
					) {
						this.hasChange = true;
					} else {
						this.hasChange = false;
					}
					console.log(this.hasChange);
				}
			});
	}
	update() {
		this.service
			.updateById(this.id, this.editForm.value)
			.pipe(
				tap((data) => {
					if (data) {
						this.router.navigate(['/dashboard/color']);
					}
				}),
				takeUntil(this.unsubscribeSubject$)
			)
			.subscribe();
	}
	goBack() {
		this.router.navigate(['/dashboard/color']);
	}

	ngOnDestroy() {
		this.store.reset();
		this.unsubscribeSubject$.next();
		this.unsubscribeSubject$.complete();
	}
}
