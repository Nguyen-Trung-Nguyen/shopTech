import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {
	defaultEditorExtensions,
	tuiLegacyEditorConverter,
	TUI_EDITOR_CONTENT_PROCESSOR,
	TUI_EDITOR_EXTENSIONS,
	TUI_IMAGE_LOADER,
} from '@taiga-ui/addon-editor';
import { TuiPreviewDialogService } from '@taiga-ui/addon-preview';
import { tuiIsPresent } from '@taiga-ui/cdk';
import { TuiDialogContext, TUI_NUMBER_FORMAT } from '@taiga-ui/core';
import { TuiFileLike } from '@taiga-ui/kit';
import {
	BehaviorSubject,
	filter,
	forkJoin,
	map,
	Observable,
	Subject,
	switchMap,
	takeUntil,
	tap,
} from 'rxjs';
import { imageLoader, ImgbbService } from 'src/app/@core/service/image-bb.service';
import { ImageProcessingService } from 'src/app/@core/service/image-processing.service';
import { validateRequired } from 'src/app/@shared/validators/custom-validator';
import { ProductQuery } from '../../state/product.query';
import { ProductService } from '../../state/product.service';
import { ProductStore } from '../../state/product.store';
@Component({
	selector: 'app-eidt-product-page',
	templateUrl: './eidt-product-page.component.html',
	styleUrls: ['./eidt-product-page.component.scss'],
	providers: [
		{
			provide: TUI_EDITOR_EXTENSIONS,
			useValue: defaultEditorExtensions,
		},
		{
			provide: TUI_EDITOR_CONTENT_PROCESSOR,
			useValue: tuiLegacyEditorConverter,
		},
		{
			provide: TUI_IMAGE_LOADER,
			useFactory: imageLoader,
			deps: [ImgbbService],
		},
		{
			provide: TUI_NUMBER_FORMAT,
			useValue: { decimalSeparator: `,`, thousandSeparator: `.` },
		},
	],
})
export class EidtProductPageComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	slug: string = '';
	rejectedImages: readonly TuiFileLike[] = [];
	rejectedThumbnail$ = new Subject<TuiFileLike | null>();
	//form
	editForm: FormGroup;

	colorForm: FormArray;
	capacityForm: FormArray;
	descriptionControl: FormControl;
	unSubcribeSubject$ = new Subject<void>();
	productDetail$: Observable<any>;
	//image review
	listUrlImage: Array<any> = [];
	urlThumbnailPreview: any = '';
	index = 0;
	categories$: Observable<any>;
	colors$: Observable<any>;
	capacities$: Observable<any>;
	payPrice: number = 0;
	readonly stringify = ({ name }: any): string => `${name} `;

	// for preview image
	@ViewChild('preview')
	readonly preview: TemplateRef<TuiDialogContext<void>>;
	readonly index$$ = new BehaviorSubject<number>(0);
	readonly item$ = this.index$$.pipe(
		map((index) => this.listUrlImage[index]),
		filter(tuiIsPresent)
	);
	readonly title$ = this.item$.pipe(map((item) => item.name));
	readonly imageSrc$ = this.item$.pipe(map((item) => item.url));
	///end preview image
	updatedAt: any = '';
	constructor(
		private fb: FormBuilder,
		private sanitizer: DomSanitizer,
		@Inject(TuiPreviewDialogService) private readonly previewService: TuiPreviewDialogService,
		private productService: ProductService,
		private productQuery: ProductQuery,
		private productStore: ProductStore,
		private activatedRoute: ActivatedRoute,
		private imageService: ImageProcessingService
	) {}

	ngOnInit(): void {
		this.initFom();
		this.fetchInit();
		this.initValue();
		this.patchValue().pipe(takeUntil(this.unSubcribeSubject$)).subscribe();
		this.getUrlImagePreview().pipe(takeUntil(this.unSubcribeSubject$)).subscribe();
		this.getUrlThumbnailPreview().pipe(takeUntil(this.unSubcribeSubject$)).subscribe();
		this.onColorChanges();
		this.onCapacityChanges();
	}

	fetchInit() {
		this.activatedRoute.paramMap
			.pipe(
				takeUntil(this.unSubcribeSubject$),
				switchMap((params) => {
					let slug = params.get('slug').toString();
					return this.productService.findBySlug(slug);
				})
			)
			.subscribe();
	}
	initFom() {
		this.editForm = this.fb.group({
			name: ['', [validateRequired]],
			categories: [[], validateRequired],
			colors: [[]],
			capacities: [[]],
			status: [false],
			isNew: [false],
			isTrend: [false],
			images: [null, [Validators.required]],
			thumbnail: [null, validateRequired],
		});

		this.colorForm = this.fb.array([]);
		this.capacityForm = this.fb.array([]);
		this.descriptionControl = this.fb.control('', [Validators.required]);
	}

	initValue() {
		this.loading$ = this.productQuery.select('loading');
		this.productDetail$ = this.productQuery.select('productDetail');
		this.categories$ = this.productQuery.getCategories();
		this.colors$ = this.productQuery.getColors();
		this.capacities$ = this.productQuery.getCapacities();
	}

	patchValue() {
		return this.productDetail$.pipe(
			tap((data) => {
				if (data) {
					const arrayImage: Array<any> = data.images;
					let obs = arrayImage.map((i) => this.imageService.dataURIToFile(i));
					let source = forkJoin(obs);
					source.subscribe((data) => {
						this.editForm.get('images').setValue(data);
					});
					const thumbnailImage = data.thumbnail;
					this.imageService.dataURIToFile(thumbnailImage).subscribe((data) => {
						this.editForm.get('thumbnail').setValue(data);
					});
					this.updatedAt = data.updatedAt;
					this.slug = data.slug;
					this.editForm.patchValue({
						name: data.name,
						categories: data.categories,
						colors: data.colors,
						status: data.status,
						isNew: data.isNew,
						isTrend: data.isTrend,
						capacities: data.capacities,
					});
					this.descriptionControl.patchValue(data.description);
				}
			})
		);
	}

	onColorChanges() {
		this.editForm.get('colors').valueChanges.subscribe((data) => {
			this.colorForm.clear();
			if (data) {
				for (let i = 0; i < data.length; i++) {
					const group = this.fb.group({
						name: [data[i].name || ''],
						price: [data[i].price || 0],
						payPrice: [data[i].payPrice || 0],
						percent: [data[i].percent || 0],
						stock: [data[i].stock || 0],
					});
					this.colorForm.push(group);
				}
			}
		});
	}
	getColorByIndex(index: number): FormGroup {
		return this.colorForm.at(index) as FormGroup;
	}
	calPayPriceColor(i: number) {
		let payPrice = 0;
		const percent = this.colorForm.controls[i].value.percent;
		const price = this.colorForm.controls[i].value.price;
		if (percent && price) {
			payPrice = price - (price * percent) / 100;
		}
		this.colorForm.controls[i].get('payPrice').setValue(Math.round(payPrice / 1000) * 1000);
	}
	onCapacityChanges() {
		this.editForm.get('capacities').valueChanges.subscribe((data) => {
			this.capacityForm.clear();
			if (data) {
				for (let i = 0; i < data.length; i++) {
					const group = this.fb.group({
						name: [data[i].name || ''],
						price: [data[i].price || 0],
						payPrice: [data[i].payPrice || 0],
						percent: [data[i].percent || 0],
						stock: [data[i].stock || 0],
					});
					this.capacityForm.push(group);
				}
			}
		});
	}

	getCapacityByIndex(index: number): FormGroup {
		return this.capacityForm.at(index) as FormGroup;
	}
	calPayPriceCapacity(i: number) {
		let payPrice = 0;
		const percent = this.capacityForm.controls[i].value.percent;
		const price = this.capacityForm.controls[i].value.price;
		if (percent && price) {
			payPrice = price - (price * percent) / 100;
		}
		this.capacityForm.controls[i].get('payPrice').setValue(Math.round(payPrice / 1000) * 1000);
	}
	getUrlImagePreview() {
		return this.editForm.get('images').valueChanges.pipe(
			tap((data) => {
				if (data) {
					let array = [];
					for (let i = 0; i < data.length; i++) {
						const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(data[i]));
						const fileHandled = {
							name: data[i].name,
							url: url,
						};
						array.push(fileHandled);
					}
					this.listUrlImage = array;
				}
			})
		);
	}

	getUrlThumbnailPreview() {
		return this.editForm.get('thumbnail').valueChanges.pipe(
			tap((data) => {
				if (data) {
					this.urlThumbnailPreview = this.sanitizer.bypassSecurityTrustUrl(
						window.URL.createObjectURL(data)
					);
				}
			})
		);
	}
	generateProductEntry() {
		const colorAttr: Array<any> = this.colorForm.value || [];
		const capacityAttr: Array<any> = this.capacityForm.value || [];
		var productEntry = [];
		const f = (a: any, b: any) =>
			[].concat(...a.map((d: any) => b.map((e: any) => [].concat(d, e))));
		const cartesian: any = (a: any, b: any, ...c: any) => (b ? cartesian(f(a, b), ...c) : a);
		if (colorAttr.length > 0) {
			productEntry = colorAttr.map((x: any) => ({
				color: x.name,
				price: x.price,
				payPrice: x.payPrice,
				percent: x.percent,
				stock: x.stock,
			}));
		}
		if (capacityAttr.length > 0) {
			productEntry = capacityAttr;
		}
		if (capacityAttr.length > 0 && colorAttr.length > 0) {
			const atributeArr = cartesian(colorAttr, capacityAttr);
			productEntry = atributeArr.map((x: any) => ({
				color: x[0].name,
				capacity: x[1].name,
				price: Math.max(x[0].price, x[1].price),
				payPrice: Math.max(x[0].payPrice, x[1].payPrice),
				percent: Math.max(x[0].percent, x[1].percent),
				stock: Math.max(x[0].stock, x[1].stock),
			}));
		}
		return productEntry;
	}
	update() {
		const productEntry = this.generateProductEntry();
		const editFormValue = this.editForm.value;
		const listCategory: Array<any> = editFormValue.categories;
		const request = {
			name: editFormValue.name,
			categories: listCategory.map((c) => c.name),
			colors: this.colorForm.value,
			capacities: this.capacityForm.value,
			status: this.editForm.value.status,
			isNew: editFormValue.isNew,
			isTrend: editFormValue.isTrend,
			description: this.descriptionControl.value,
		};
		const images = this.editForm.value.images;
		const thumbnail = this.editForm.value.thumbnail;
		this.productService
			.updateBySlug(this.slug, productEntry, request, images, thumbnail)
			.pipe(takeUntil(this.unSubcribeSubject$))
			.subscribe();
	}

	showPreview(index: number): void {
		this.index$$.next(index);
		this.previewService
			.open(this.preview || ``, {})
			.pipe(takeUntil(this.unSubcribeSubject$))
			.subscribe();
	}

	showInCarsouel(index: number) {
		this.index = index;
	}

	onRejectImages(files: TuiFileLike | readonly TuiFileLike[]): void {
		this.rejectedImages = [...this.rejectedImages, ...(files as TuiFileLike[])];
	}
	clearRejectedImages({ name }: TuiFileLike): void {
		this.rejectedImages = this.rejectedImages.filter((rejected) => rejected.name !== name);
	}
	removeFile({ name }: File): void {
		this.editForm
			.get('images')
			.setValue(this.editForm.value.images?.filter((current: File) => current.name !== name) ?? []);
	}
	onRejectThumbnail(file: TuiFileLike | readonly TuiFileLike[]): void {
		this.rejectedThumbnail$.next(file as TuiFileLike);
	}

	clearRejectedThumbnail(): void {
		this.rejectedThumbnail$.next(null);
	}
	removeThumbnail() {
		this.editForm.get('thumbnail').setValue(null);
		this.urlThumbnailPreview = '';
	}
	ngOnDestroy(): void {
		this.productStore.update((state) => ({
			productDetail: null,
		}));
		this.unSubcribeSubject$.next();
		this.unSubcribeSubject$.complete();
	}
}
