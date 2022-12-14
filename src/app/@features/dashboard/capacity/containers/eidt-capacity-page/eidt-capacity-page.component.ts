import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, skip, Subject, takeUntil, tap } from 'rxjs';
import {
	validateRequired,
	validateSpecialChacracter,
} from 'src/app/@shared/validators/custom-validator';
import { CapacityQuery } from '../../state/capacity.query';
import { CapacityService } from '../../state/capacity.service';
import { CapacityStore } from '../../state/capacity.store';

@Component({
	selector: 'app-eidt-capacity-page',
	templateUrl: './eidt-capacity-page.component.html',
	styleUrls: ['./eidt-capacity-page.component.scss'],
})
export class EidtCapacityPageComponent implements OnInit, OnDestroy {
	editForm: FormGroup;
	capacity$: Observable<any>;
	unsubscribeSubject$ = new Subject<void>();
	id: number;
	initialValueForm: any = null;
	hasChange = true;
	loading$: Observable<boolean>;

	constructor(
		private activatedRoute: ActivatedRoute,
		private fb: FormBuilder,
		private router: Router,
		private service: CapacityService,
		private query: CapacityQuery,
		private store: CapacityStore
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
		this.capacity$ = this.query.select('capacity');
		this.loading$ = this.query.selectLoading();
		this.patchValue().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
	}
	initFom() {
		this.editForm = this.fb.group({
			name: ['', [validateRequired, Validators.maxLength(20), validateSpecialChacracter]],
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
		return this.capacity$.pipe(
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
						this.router.navigate(['/dashboard/capacity']);
					}
				}),
				takeUntil(this.unsubscribeSubject$)
			)
			.subscribe();
	}
	goBack() {
		this.router.navigate(['/dashboard/capacity']);
	}

	ngOnDestroy() {
		this.store.reset();
		this.unsubscribeSubject$.next();
		this.unsubscribeSubject$.complete();
	}
}
