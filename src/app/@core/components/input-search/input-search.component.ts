import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TUI_NUMBER_FORMAT } from '@taiga-ui/core';
import { debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
import { HomeQuery } from 'src/app/@features/home/state/home.query';
import { HomeService } from 'src/app/@features/home/state/home.service';
import { removeSpecialChar, stringToSlug } from 'src/app/@shared/utils/string.utils';

@Component({
	selector: 'app-input-search',
	templateUrl: './input-search.component.html',
	styleUrls: ['./input-search.component.scss'],
	providers: [
		{
			provide: TUI_NUMBER_FORMAT,
			useValue: { decimalSeparator: `,`, thousandSeparator: `.` },
		},
	],
})
export class InputSearchComponent implements OnInit {
	search = new FormControl('', [Validators.required]);
	searchResult$: Observable<any>;
	constructor(
		private homeService: HomeService,
		private homeQuery: HomeQuery,
		private router: Router
	) {}

	ngOnInit(): void {
		this.searchResult$ = this.homeQuery.select('searchResult');
		this.valueChanges();
	}
	sendit($event: any) {
		if (this.search.invalid) {
			return;
		} else {
			const value = $event.target.value;
			const noSpecicalChar = removeSpecialChar(value);
			const param = stringToSlug(noSpecicalChar);
			this.router.navigate(['/search'], {
				queryParams: {
					keyword: param,
				},
			});
		}
	}

	valueChanges() {
		this.search.valueChanges
			.pipe(
				debounceTime(500),
				distinctUntilChanged(),
				switchMap((data) => {
					const value = data;
					const noSpecicalChar = removeSpecialChar(value);
					const keyword = stringToSlug(noSpecicalChar);
					const page = 0;
					const size = 5;
					return this.homeService.search(keyword, page, size);
				})
			)
			.subscribe();
	}
}
