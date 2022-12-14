import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TuiFileLike } from '@taiga-ui/kit';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { validateRequired } from 'src/app/@shared/validators/custom-validator';
import { CategoryQuery } from '../../state/category.query';
import { CategoryService } from '../../state/category.service';
@Component({
	selector: 'app-add-form-category',
	templateUrl: './add-form-category.component.html',
	styleUrls: ['./add-form-category.component.scss'],
})
export class AddFormCategoryComponent implements OnInit, OnDestroy {
	addForm: FormGroup;
	parentCategories$: Observable<any>;
	urlImagePreview: any = '';
	unsubscribeSubject$ = new Subject();
	readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
	constructor(
		private fb: FormBuilder,
		private query: CategoryQuery,
		private service: CategoryService,
		private router: Router,
		private sanitizer: DomSanitizer
	) {}

	ngOnInit(): void {
		this.initFom();
		this.service.getAllParentToSelect().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
		this.parentCategories$ = this.query.select('parentCategories');

		this.getUrlImagePreview().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
	}
	initFom() {
		this.addForm = this.fb.group({
			name: ['', [validateRequired, Validators.maxLength(50)]],
			parent: [null],
			file: [null, validateRequired],
		});
	}
	create() {
		const file = this.addForm.value.file;
		const parentObject = this.addForm.value.parent;
		const data: any = {
			name: this.addForm.value.name,
			parent: null,
		};
		if (parentObject !== null) {
			data.parent = parentObject.name;
		}
		this.service
			.create(file, data)
			.pipe(
				tap((data) => {
					if (data instanceof HttpResponse) {
						this.service
							.getAll({ name: 'Parent', value: 'parent' })
							.pipe(takeUntil(this.unsubscribeSubject$))
							.subscribe();
						this.query.setExpanedAddForm(false);
					}
				}, takeUntil(this.unsubscribeSubject$))
			)
			.subscribe();
	}
	removeFile(): void {
		this.addForm.patchValue({
			file: null,
		});
	}
	getUrlImagePreview() {
		return this.addForm.get('file').valueChanges.pipe(
			tap((data) => {
				if (data) {
					this.urlImagePreview = this.sanitizer.bypassSecurityTrustUrl(
						window.URL.createObjectURL(data)
					);
				}
			})
		);
	}
	onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
		this.rejectedFiles$.next(file as TuiFileLike);
	}

	clearRejected(): void {
		this.rejectedFiles$.next(null);
	}
	ngOnDestroy() {
		this.unsubscribeSubject$.next(0);
		this.unsubscribeSubject$.unsubscribe();
	}
}
