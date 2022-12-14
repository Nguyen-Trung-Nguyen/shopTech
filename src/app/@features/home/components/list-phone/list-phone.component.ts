import { Component, Input, OnInit } from '@angular/core';
import { TUI_NUMBER_FORMAT } from '@taiga-ui/core';
import { map, Observable } from 'rxjs';
import { HomeService } from '../../state/home.service';

@Component({
	selector: 'app-list-phone',
	templateUrl: './list-phone.component.html',
	styleUrls: ['./list-phone.component.scss'],
	providers: [
		{
			provide: TUI_NUMBER_FORMAT,
			useValue: { decimalSeparator: `,`, thousandSeparator: `.` },
		},
	],
})
export class ListPhoneComponent implements OnInit {
	@Input() data: { banner: string; slug: string };
	index = 0;
	banner$: Observable<any>;
	phones$: Observable<any>;
	constructor(private service: HomeService) {}

	ngOnInit(): void {
		this.banner$ = this.service.getImageByContent(this.data.banner);
		this.phones$ = this.service.getAllByCat(this.data.slug, 0).pipe(
			map((data) => {
				return data.sort(() => Math.random() - 0.5);
			})
		);
	}
	
}
