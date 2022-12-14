import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, tap } from 'rxjs';
import { validateRequired } from 'src/app/@shared/validators/custom-validator';
import { CapacityQuery } from '../../state/capacity.query';
import { CapacityService } from '../../state/capacity.service';

@Component({
	selector: 'app-add-capacity-form',
	templateUrl: './add-capacity-form.component.html',
	styleUrls: ['./add-capacity-form.component.scss'],
})
export class AddCapacityFormComponent implements OnInit, OnDestroy {
	addForm: FormGroup;
	unsubscribeSubject$ = new Subject();
	constructor(
		private fb: FormBuilder,
		private query: CapacityQuery,
		private service: CapacityService
	) {}

	ngOnInit(): void {
		this.initFom();
	}

	initFom() {
		this.addForm = this.fb.group({
			name: ['', [validateRequired, Validators.maxLength(20)]],
		});
	}
	create() {
		this.service
			.create(this.addForm.value)
			.pipe(
				tap((data) => {
					if (data) {
						this.service.getAll().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
						this.query.setExpanedAddForm(false);
					}
				}, takeUntil(this.unsubscribeSubject$))
			)
			.subscribe();
	}

	ngOnDestroy() {
		this.unsubscribeSubject$.next(0);
		this.unsubscribeSubject$.unsubscribe();
	}
}
