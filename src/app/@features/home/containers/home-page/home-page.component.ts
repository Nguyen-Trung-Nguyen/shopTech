import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { HomeService } from '../../state/home.service';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
	index = 0;
	carousels$: Observable<any>;
	banners$: Observable<any>;
	arrayCategory = [
		{
			banner: 'PHONE_BANNER',
			slug: 'dien-thoai',
		},
		{
			banner: 'LAPTOP_BANNER',
			slug: 'laptop',
		},
		{
			banner: 'TABLET_BANNER',
			slug: 'tablet',
		},
		{
			banner: 'ACCESSORY_BANNER',
			slug: 'phu-kien',
		},
	];
	constructor(private title: Title, private service: HomeService) {}

	ngOnInit(): void {
		this.carousels$ = this.service.getImageByContent('HOME_CAROUSEL');
		this.banners$ = this.service.getImageByContent('HOME_BANNER');
	}
}
