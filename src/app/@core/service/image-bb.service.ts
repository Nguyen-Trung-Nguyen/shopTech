import { Injectable } from '@angular/core';
import { from, fromEvent, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
interface ImgbbResponse {
	data: {
		id: string;
		title: string;
		url: string;
		width: string;
		height: string;
		size: number;
		time: string;
		expiration: string;
	};
	success: boolean;
	status: number;
}

export function imageLoader(service: ImgbbService): (file: File) => Observable<string> {
	return (file: File) => {
		const fileReader = new FileReader();

		fileReader.readAsDataURL(file);

		return fromEvent(fileReader, `load`)
			.pipe(map(() => String(fileReader.result)))
			.pipe(switchMap((base64) => service.save(base64)));
	};
}

@Injectable({
	providedIn: `root`,
})
export class ImgbbService {
	private static createBody(base64: string): URLSearchParams {
		const formData = new FormData();

		formData.append(`image`, base64.split(`,`).pop() || ``);

		return new URLSearchParams(formData as any);
	}

	save(base64: string): Observable<string> {
		const { host, apiKey } = environment.imgbb;

		return from(
			fetch(`${host}/1/upload?key=${apiKey}`, {
				method: `POST`,
				body: ImgbbService.createBody(base64),
				headers: { 'Content-Type': `application/x-www-form-urlencoded` },
			}).then(async (response: Response) => response.json())
		).pipe(map((response: ImgbbResponse) => response.data.url));
	}
}
