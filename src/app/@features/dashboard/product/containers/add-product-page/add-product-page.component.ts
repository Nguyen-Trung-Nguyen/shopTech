import { HttpResponse } from '@angular/common/http';
import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	OnDestroy,
	OnInit,
	TemplateRef,
	ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {
	defaultEditorExtensions,
	tuiLegacyEditorConverter,
	TUI_EDITOR_CONTENT_PROCESSOR,
	TUI_EDITOR_EXTENSIONS,
} from '@taiga-ui/addon-editor';
import { TuiPreviewDialogService } from '@taiga-ui/addon-preview';
import { tuiIsPresent } from '@taiga-ui/cdk';
import { TuiDialogContext, TUI_NUMBER_FORMAT } from '@taiga-ui/core';
import { TuiFileLike } from '@taiga-ui/kit';
import { BehaviorSubject, filter, map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { validateRequired } from 'src/app/@shared/validators/custom-validator';
import { ProductQuery } from '../../state/product.query';
import { ProductService } from '../../state/product.service';
import { ProductStore } from '../../state/product.store';
@Component({
	selector: 'app-add-product-page',
	templateUrl: './add-product-page.component.html',
	styleUrls: ['./add-product-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
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
			provide: TUI_NUMBER_FORMAT,
			useValue: { decimalSeparator: `,`, thousandSeparator: `.` },
		},
	],
})
export class AddProductPageComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	rejectedImages: readonly TuiFileLike[] = [];
	rejectedThumbnail$ = new Subject<TuiFileLike | null>();
	//form
	addForm: FormGroup;

	colorForm: FormArray;
	capacityForm: FormArray;

	unSubcribeSubject$ = new Subject<void>();
	//image review
	listUrlImage: Array<any> = [];
	urlThumbnailPreview: any = '';
	index = 0;
	categories$: Observable<any>;
	colors$: Observable<any>;
	capacities$: Observable<any>;
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

	constructor(
		private fb: FormBuilder,
		private sanitizer: DomSanitizer,
		@Inject(TuiPreviewDialogService) private readonly previewService: TuiPreviewDialogService,
		private productService: ProductService,
		private productQuery: ProductQuery,
		private productStore: ProductStore
	) {}

	ngOnInit(): void {
		this.initFom();
		this.fetchInit();
		this.initValue();
		this.getUrlImagePreview().pipe(takeUntil(this.unSubcribeSubject$)).subscribe();
		this.getUrlThumbnailPreview().pipe(takeUntil(this.unSubcribeSubject$)).subscribe();
		this.onColorChanges();
		this.onCapacityChanges();
	}

	fetchInit() {}
	initValue() {
		this.loading$ = this.productQuery.select('loading');
		this.categories$ = this.productQuery.getCategories();
		this.colors$ = this.productQuery.getColors();
		this.capacities$ = this.productQuery.getCapacities();
	}

	initFom() {
		this.addForm = this.fb.group({
			name: ['', [validateRequired]],
			categories: [null, validateRequired],
			colors: [null, validateRequired],
			capacities: [null],
			images: [null, validateRequired],
			thumbnail: [null, validateRequired],
			status: [false],
		});
		this.colorForm = this.fb.array([]);
		this.capacityForm = this.fb.array([]);
	}

	onCapacityChanges() {
		this.addForm.get('capacities').valueChanges.subscribe((data) => {
			this.capacityForm.clear();
			if (data) {
				for (let i = 0; i < data.length; i++) {
					const group = this.fb.group({
						name: [data[i].name],
						price: [0],
						stock: [0],
					});
					this.capacityForm.push(group);
				}
			}
		});
	}

	onColorChanges() {
		this.addForm.get('colors').valueChanges.subscribe((data) => {
			this.colorForm.clear();
			if (data) {
				for (let i = 0; i < data.length; i++) {
					const group = this.fb.group({
						name: [data[i].name],
						price: [0],
						stock: [0],
					});
					this.colorForm.push(group);
				}
			}
		});
	}
	getColorByIndex(index: number): FormGroup {
		return this.colorForm.at(index) as FormGroup;
	}
	getCapacityByIndex(index: number): FormGroup {
		return this.capacityForm.at(index) as FormGroup;
	}

	generateProductEntry() {
		const colorAttr = this.colorForm.value;
		const capacityAttr = this.capacityForm.value;
		var productEntry = [];
		const f = (a: any, b: any) =>
			[].concat(...a.map((d: any) => b.map((e: any) => [].concat(d, e))));
		const cartesian: any = (a: any, b: any, ...c: any) => (b ? cartesian(f(a, b), ...c) : a);
		if (colorAttr.length > 0) {
			productEntry = colorAttr;
		}
		if (capacityAttr.length > 0) {
			productEntry = colorAttr.map((x: any) => ({
				color: x.name,
				price: x.price,
				payPrice: x.payPrice,
				percent: x.percent,
				stock: x.stock,
			}));
		}
		if (capacityAttr.length > 0 && colorAttr.length > 0) {
			const atributeArr = cartesian(colorAttr, capacityAttr);
			productEntry = atributeArr.map((x: any) => ({
				color: x[0].name,
				capacity: x[1].name,
				price: Math.max(x[0].price, x[1].price),
				stock: Math.max(x[0].stock, x[1].stock),
			}));
		}
		return productEntry;
	}

	create() {
		const productEntry = this.generateProductEntry();
		const colorFormValue: Array<any> = this.colorForm.value || [];
		const capacityFormValue = this.capacityForm.value || [];
		const listCategory: Array<any> = this.addForm.value.categories || [];
		const request = {
			name: this.addForm.value.name,
			categories: listCategory.map((c) => c.name),
			colors: colorFormValue,
			capacities: capacityFormValue,
			status: this.addForm.value.status || false,
		};
		const images = this.addForm.value.images;
		const thumbnail = this.addForm.value.thumbnail;
		this.productService
			.create(request, productEntry, images, thumbnail)
			.pipe(
				takeUntil(this.unSubcribeSubject$),
				tap((data) => {
					if (data instanceof HttpResponse) {
						this.addForm.reset();
						this.listUrlImage = [];
						this.urlThumbnailPreview = '';
					}
				})
			)
			.subscribe();
	}

	getUrlImagePreview() {
		return this.addForm.get('images').valueChanges.pipe(
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
		return this.addForm.get('thumbnail').valueChanges.pipe(
			tap((data) => {
				if (data) {
					this.urlThumbnailPreview = this.sanitizer.bypassSecurityTrustUrl(
						window.URL.createObjectURL(data)
					);
				}
			})
		);
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
		this.addForm
			.get('images')
			.setValue(this.addForm.value.images?.filter((current: File) => current.name !== name) ?? []);
	}
	onRejectThumbnail(file: TuiFileLike | readonly TuiFileLike[]): void {
		this.rejectedThumbnail$.next(file as TuiFileLike);
	}

	clearRejectedThumbnail(): void {
		this.rejectedThumbnail$.next(null);
	}
	removeThumbnail() {
		this.addForm.get('thumbnail').setValue(null);
		this.urlThumbnailPreview = '';
	}
	ngOnDestroy(): void {
		this.productStore.reset();
		this.unSubcribeSubject$.next();
		this.unSubcribeSubject$.complete();
	}
}
