import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TuiPreviewDialogService } from '@taiga-ui/addon-preview';
import { TuiDialogContext } from '@taiga-ui/core';
@Component({
	selector: 'app-image-preview-example',
	templateUrl: './image-preview-example.component.html',
	styleUrls: ['./image-preview-example.component.scss'],
})
export class ImagePreviewExampleComponent implements OnInit {
	@ViewChild(`previewImages`)
	template?: TemplateRef<TuiDialogContext>;

	image?: HTMLImageElement;

	constructor(
		@Inject(TuiPreviewDialogService)
		private readonly dialogService: TuiPreviewDialogService
	) {}

	showImage(image: HTMLImageElement): void {
		this.image = image;
		this.dialogService.open(this.template || ``).subscribe();
	}
	ngOnInit(): void {}
}
