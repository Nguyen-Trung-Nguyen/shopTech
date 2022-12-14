import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiFileLike } from '@taiga-ui/kit';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { ImageProcessingService } from 'src/app/@core/service/image-processing.service';
import {
	validateRequired,
	validateSpecialChacracter,
} from 'src/app/@shared/validators/custom-validator';
import { CategoryQuery } from '../../state/category.query';
import { CategoryService } from '../../state/category.service';
import { CategoryStore } from '../../state/category.store';
@Component({
	selector: 'app-eidt-category-page',
	templateUrl: './eidt-category-page.component.html',
	styleUrls: ['./eidt-category-page.component.scss'],
})
export class EidtCategoryPageComponent implements OnInit, OnDestroy {
	editForm: FormGroup;
	category$: Observable<any>;
	unsubscribeSubject$ = new Subject<void>();
	urlImagePreview: any;
	parentCategories$: Observable<any>;
	id: number;
	initialValueForm: any;
	hasChange = false;
	readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
	loading$: Observable<boolean>;
	testUrl: any;
	constructor(
		private activatedRoute: ActivatedRoute,
		private fb: FormBuilder,
		private router: Router,
		private service: CategoryService,
		private query: CategoryQuery,
		private sanitizer: DomSanitizer,
		private store: CategoryStore,
		private imageService: ImageProcessingService
	) {}

	ngOnInit(): void {
		this.initFom();
		this.fetchInit().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
		this.service.getAllParentToSelect().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
		this.category$ = this.query.select('category');
		this.parentCategories$ = this.query.select('parentCategories');
		this.loading$ = this.query.selectLoading();
		this.patchValue().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
		this.getUrlImagePreview().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
	}

	initFom() {
		this.editForm = this.fb.group({
			name: ['', [validateRequired, Validators.maxLength(50), validateSpecialChacracter]],
			parent: [null],
			file: [null, validateRequired],
		});
	}
	fetchInit() {
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
		return this.category$.pipe(
			tap((data) => {
				if (data) {
					const image = data.image;
					this.editForm.patchValue(data);
					this.imageService.dataURIToFile(image).subscribe((data) => {
						this.editForm.get('file').setValue(data);
						this.initialValueForm = this.editForm.value;
					});
				}
			})
		);
	}

	checkFormChange() {
		this.editForm.valueChanges.pipe(takeUntil(this.unsubscribeSubject$)).subscribe((value) => {
			if (Object.entries(this.initialValueForm).toString() === Object.entries(value).toString()) {
				this.hasChange = true;
			} else {
				this.hasChange = false;
			}
		});
	}
	update() {
		const file = this.editForm.value.file;
		const obj = this.editForm.value.parent;
		const data: any = {
			name: this.editForm.value.name,
			parent: null,
		};
		if (obj !== null) {
			data.parent = obj.name;
		}
		this.service
			.updateById(this.id, file, data)
			.pipe(
				tap((data) => {
					if (data instanceof HttpResponse) {
						this.router.navigate(['/dashboard/category']);
					}
				}),
				takeUntil(this.unsubscribeSubject$)
			)
			.subscribe();
	}
	goBack() {
		this.router.navigate(['/dashboard/category']);
	}
	removeFile(): void {
		this.editForm.patchValue({
			file: null,
		});
	}

	getUrlImagePreview() {
		return this.editForm.get('file').valueChanges.pipe(
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
		this.store.reset();
		this.unsubscribeSubject$.next();
		this.unsubscribeSubject$.complete();
	}
}
