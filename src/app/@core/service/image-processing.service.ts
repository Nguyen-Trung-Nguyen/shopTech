import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { from, map } from 'rxjs';
@Injectable({
	providedIn: 'root',
})
export class ImageProcessingService {
	constructor(private sanitizer: DomSanitizer) {}

	dataURIToFile(image: any) {
		return from(
			fetch(image.url, {
				method: `GET`,
			}).then((response) => response.blob())
		).pipe(
			map((response) => {
				const imageFile = new File([response], image.name, {
					type: image.type,
				});
				return imageFile;
			})
		);
	}

	dataURItoBlob(picBytes: string, imageType: string) {
		const byteString = window.atob(picBytes);
		const arrayBuffer = new ArrayBuffer(byteString.length);
		const int8Array = new Uint8Array(arrayBuffer);

		for (let i = 0; i < byteString.length; i++) {
			int8Array[i] = byteString.charCodeAt(i);
		}
		const blob = new Blob([int8Array], { type: imageType });
		return blob;
	}

	handleFile(image: any) {
		const imageBlob = this.dataURItoBlob(image.picBytes, image.type);
		const imageFile = new File([imageBlob], image.name, {
			type: image.type,
		});
		const newImage = {
			file: imageFile,
			url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile)),
		};
		return newImage;
	}
}
