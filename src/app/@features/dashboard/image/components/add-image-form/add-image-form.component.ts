import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TuiFileLike } from '@taiga-ui/kit';
import { Subject, takeUntil, tap } from 'rxjs';
import { validateRequired } from 'src/app/@shared/validators/custom-validator';
import { ImageQuery } from '../../state/image.query';
import { ImageService } from '../../state/image.service';
@Component({
	selector: 'app-add-image-form',
	templateUrl: './add-image-form.component.html',
	styleUrls: ['./add-image-form.component.scss'],
})
export class AddImageFormComponent implements OnInit, OnDestroy {
	addForm: FormGroup;
	urlImagePreview: any = '';
	unsubscribeSubject$ = new Subject();
	option: Array<any> = [
		'HOME_BANNER',
		'HOME_CAROUSEL',
		'PHONE_BANNER',
		'LAPTOP_BANNER',
		'TABLET_BANNER',
		'ACCESSORY_BANNER',
	];
	readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
	constructor(
		private fb: FormBuilder,
		private query: ImageQuery,
		private service: ImageService,
		private router: Router,
		private sanitizer: DomSanitizer
	) {}
	ngOnInit(): void {
		this.initFom();

		this.getUrlImagePreview().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
	}
	initFom() {
		this.addForm = this.fb.group({
			content: [''],
			file: [null, validateRequired],
		});
	}
	create() {
		const file = this.addForm.value.file;
		const data = this.addForm.value.content;
		this.service.create(file, data).subscribe((success) => {
			if (success instanceof HttpResponse) {
				this.service.getAll(data).subscribe();
				this.query.setExpanedAddForm(false);
			}
		});
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
