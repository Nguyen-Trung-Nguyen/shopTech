import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiPreviewDialogService } from '@taiga-ui/addon-preview';
import { TuiTableBarsService } from '@taiga-ui/addon-tablebars';
import { TuiDialogContext } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Observable, startWith, Subject, Subscription, tap } from 'rxjs';
import { ImageQuery } from '../../state/image.query';
import { ImageService } from '../../state/image.service';
import { ImageStore } from '../../state/image.store';

@Component({
	selector: 'app-list-image-page',
	templateUrl: './list-image-page.component.html',
	styleUrls: ['./list-image-page.component.scss'],
})
export class ListImagePageComponent implements OnInit {
	@ViewChild(`tableBarTemplate`)
	tableBarTemplate: PolymorpheusContent = ``;
	images$: Observable<any>;
	expandedAddform$: Observable<boolean>;
	optionFilter: Array<any> = [
		'HOME_BANNER',
		'HOME_CAROUSEL',
		'PHONE_BANNER',
		'LAPTOP_BANNER',
		'TABLET_BANNER',
		'ACCESSORY_BANNER',
	];
	filter = new FormControl(this.optionFilter[0]);
	loading$: Observable<boolean>;
	id: number = 0;
	subscriptionTableBar = new Subscription();
	unsubscribeSubject$ = new Subject();
	@ViewChild(`preview`)
	readonly preview?: TemplateRef<TuiDialogContext<void>>;
	constructor(
		private service: ImageService,
		private query: ImageQuery,
		@Inject(TuiTableBarsService)
		private tableBarsService: TuiTableBarsService,
		private router: Router,
		private store: ImageStore,
		@Inject(TuiPreviewDialogService) private readonly previewService: TuiPreviewDialogService
	) {}

	ngOnInit(): void {
		this.setValue();
		this.onFilter();
	}

	setValue() {
		this.images$ = this.query.select('images');
		this.expandedAddform$ = this.query.select('expanedAddForm');
		this.loading$ = this.query.selectLoading();
	}
	showAddForm() {
		this.query.toggleAddform();
	}
	showPreview(): void {
		this.previewService.open(this.preview || ``, {}).subscribe();
	}

	onFilter() {
		this.filter.valueChanges
			.pipe(
				startWith(this.optionFilter[0]),
				tap((data) => {
					this.service.getAll(data).subscribe();
				})
			)
			.subscribe();
	}
	remove() {
		this.service.deleteById(this.id).subscribe();
		this.subscriptionTableBar.unsubscribe();
	}
	showTableBar(id: number) {
		if (id) this.id = id;
		this.subscriptionTableBar = this.tableBarsService
			.open(this.tableBarTemplate || ``, {
				hasCloseButton: true,
			})
			.subscribe();
	}

	goToEditPage(id: number) {
		let currentUrl = this.router.url;
		window.scroll(0, 0);
		this.router.navigate([currentUrl, id]);
	}
	ngOnDestroy(): void {
		this.store.reset();
		this.unsubscribeSubject$.next(0);
		this.unsubscribeSubject$.unsubscribe();
	}
}
