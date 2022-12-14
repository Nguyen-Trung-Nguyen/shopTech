import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiFileLike } from '@taiga-ui/kit';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { ImageProcessingService } from 'src/app/@core/service/image-processing.service';
import { validateRequired } from 'src/app/@shared/validators/custom-validator';
import { ImageQuery } from '../../state/image.query';
import { ImageService } from '../../state/image.service';
import { ImageStore } from '../../state/image.store';
@Component({
	selector: 'app-edit-image-page',
	templateUrl: './edit-image-page.component.html',
	styleUrls: ['./edit-image-page.component.scss'],
})
export class EditImagePageComponent implements OnInit, OnDestroy {
	editForm: FormGroup;
	image$: Observable<any>;
	unsubscribeSubject$ = new Subject<void>();
	urlImagePreview: any;
	id: number;
	option: Array<any> = [
		'HOME_BANNER',
		'HOME_CAROUSEL',
		'PHONE_BANNER',
		'LAPTOP_BANNER',
		'TABLET_BANNER',
		'ACCESSORY_BANNER',
	];
	readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
	loading$: Observable<boolean>;
	constructor(
		private activatedRoute: ActivatedRoute,
		private fb: FormBuilder,
		private router: Router,
		private service: ImageService,
		private query: ImageQuery,
		private sanitizer: DomSanitizer,
		private store: ImageStore,
		private imageService: ImageProcessingService
	) {}

	ngOnInit(): void {
		this.initFom();
		this.fetchInit().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
		this.image$ = this.query.select('image');
		this.loading$ = this.query.selectLoading();
		this.patchValue().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
		this.getUrlImagePreview().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
	}

	initFom() {
		this.editForm = this.fb.group({
			content: ['', []],
			file: [null, validateRequired],
		});
	}
	fetchInit() {
		return this.activatedRoute.paramMap.pipe(
			tap((params) => {
				if (params) {
					this.id = parseInt(params.get('id'));
					this.service.findById(this.id).subscribe();
				}
			})
		);
	}
	patchValue() {
		return this.image$.pipe(
			tap((data) => {
				if (data) {
					this.editForm.get('content').setValue(data.content);
					this.imageService.dataURIToFile(data).subscribe((file) => {
						this.editForm.get('file').setValue(file);
					});
				}
			})
		);
	}

	update() {
		const file = this.editForm.value.file;
		const content = this.editForm.value.content;
		this.service.updateById(this.id, file, content).subscribe((data) => {
			if (data instanceof HttpResponse) {
				this.router.navigate(['/dashboard/image']);
			}
		});
	}
	goBack() {
		this.router.navigate(['/dashboard/image']);
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
