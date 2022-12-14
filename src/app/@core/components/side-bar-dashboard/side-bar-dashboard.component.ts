import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { ImageProcessingService } from 'src/app/@core/service/image-processing.service';
import { GlobalQuery } from 'src/app/@core/state/global.query';
@Component({
	selector: 'app-side-bar-dashboard',
	templateUrl: './side-bar-dashboard.component.html',
	styleUrls: ['./side-bar-dashboard.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideBarDashboardComponent implements OnInit {
	user$: Observable<any>;
	vietnamRole: string = '';
	indexExpand: number = -1;
	fullname: string = '';
	url: any = '';
	accordions: any = [];
	unsubscribeSubject$ = new Subject<void>();
	constructor(
		private globalQuery: GlobalQuery,
		private imageService: ImageProcessingService,
		private sanitizer: DomSanitizer
	) {}

	ngOnInit(): void {
		this.user$ = this.globalQuery.select('user');
		this.initData().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
		this.setAccordions();
	}

	initData() {
		return this.user$.pipe(
			tap((data) => {
				if (data) {
					if (data.avatar) {
						this.url = data.avatar.url;
					}
					const roles = data.roles;
					if (roles.includes('ROLE_ADMIN')) this.vietnamRole = 'QUẢN TRỊ';
				}
			})
		);
	}

	setAccordions() {
		this.accordions = [
			{
				name: 'Dashboard',
				imgSrc: '/assets/icon/dashboard-home.svg',
				accordionItem: [
					{
						name: 'Tổng quát',
						routerLink: '/dashboard',
					},
					{
						name: 'Doanh thu',
					},
				],
			},
			{
				name: 'Sản phẩm',
				imgSrc: '/assets/icon/box.svg',
				accordionItem: [
					{
						name: 'Physical',
						itemExpand: [
							{
								name: 'Danh sách sản phẩm',
								routerLink: '/dashboard/product',
							},
							{
								name: 'Thêm sản phẩm',
								routerLink: '/dashboard/product/add',
							},
						],
					},
					{
						name: 'Sales',
						itemExpand: [
							{
								name: 'Content 1',
							},
							{
								name: 'Content 2',
							},
						],
					},
				],
			},
			{
				name: 'Đơn đặt hàng',
				imgSrc: '/assets/icon/order.svg',
				accordionItem: [
					{
						name: 'Danh sách đơn đặt',
						routerLink: '/dashboard/order',
					},
				],
			},
			{
				name: 'Danh mục',
				imgSrc: '/assets/icon/folder-tree.svg',
				accordionItem: [
					{
						name: 'Danh sách danh mục',
						routerLink: '/dashboard/category',
					},
				],
			},
			{
				name: 'Màu sắc',
				imgSrc: '/assets/icon/color.svg',
				accordionItem: [
					{
						name: 'Danh sách màu sắc',
						routerLink: '/dashboard/color',
					},
				],
			},
			{
				name: 'Bộ nhớ trong',
				imgSrc: '/assets/icon/storage.svg',
				accordionItem: [
					{
						name: 'Danh sách bộ nhớ trong',
						routerLink: '/dashboard/capacity',
					},
				],
			},
			{
				name: 'Users',
				imgSrc: '/assets/icon/user.svg',
				accordionItem: [
					{
						name: 'Danh sách người dùng',
						routerLink: '/dashboard/user',
					},
					{
						name: 'Create User',
					},
				],
			},
			{
				name: 'Hình ảnh',
				imgSrc: '/assets/icon/image.svg',
				accordionItem: [
					{
						name: 'Danh sách hình ảnh',
						routerLink: '/dashboard/image',
					},
				],
			},
		];
	}
}
