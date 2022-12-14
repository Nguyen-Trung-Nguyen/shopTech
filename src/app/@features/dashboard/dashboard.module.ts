import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AlertNotificationModule } from 'src/app/@shared/component/alert-notification/alert-notification.module';
import { ImagePreviewExampleModule } from 'src/app/@shared/component/image-preview-example/image-preview-example.module';

import { TaigaModule } from 'src/app/@shared/taiga/taiga.module';
import { AddCapacityFormComponent } from './capacity/components/add-capacity-form/add-capacity-form.component';
import { EidtCapacityPageComponent } from './capacity/containers/eidt-capacity-page/eidt-capacity-page.component';
import { ListCapacityPageComponent } from './capacity/containers/list-capacity-page/list-capacity-page.component';
import { AddFormCategoryComponent } from './category/components/add-form-category/add-form-category.component';
import { EidtCategoryPageComponent } from './category/containers/eidt-category-page/eidt-category-page.component';
import { ListCategoryPageComponent } from './category/containers/list-category-page/list-category-page.component';
import { AddFormColorComponent } from './color/components/add-form-color/add-form-color.component';
import { EditColorPageComponent } from './color/containers/edit-color-page/edit-color-page.component';
import { ListColorPageComponent } from './color/containers/list-color-page/list-color-page.component';
import { AddImageFormComponent } from './image/components/add-image-form/add-image-form.component';
import { EditImagePageComponent } from './image/containers/edit-image-page/edit-image-page.component';
import { ListImagePageComponent } from './image/containers/list-image-page/list-image-page.component';
import { DashboardPageComponent } from './main/containers/dashboard-page/dashboard-page.component';
import { OrderDetailPageComponent } from './order/containers/order-detail-page/order-detail-page.component';
import { OrderListPageComponent } from './order/containers/order-list-page/order-list-page.component';
import { FilterListProductComponent } from './product/components/filter-list-product/filter-list-product.component';
import { AddProductPageComponent } from './product/containers/add-product-page/add-product-page.component';
import { EidtProductPageComponent } from './product/containers/eidt-product-page/eidt-product-page.component';
import { ListProductPageComponent } from './product/containers/list-product-page/list-product-page.component';
import { UserDetailPageComponent } from './user/containers/user-detail-page/user-detail-page.component';
import { UserListPageComponent } from './user/containers/user-list-page/user-list-page.component';
import { FilterOrderComponent } from './order/components/filter-order/filter-order.component';

const routes: Routes = [
	{
		path: '',
		component: DashboardPageComponent,
	},
	{
		path: 'product',
		children: [
			{
				path: '',
				component: ListProductPageComponent,
			},
			{
				path: 'add',
				component: AddProductPageComponent,
				data: {
					breadcrumb: [
						{
							label: 'Danh sách sản phẩm',
							url: '/dashboard/product',
						},
						{
							label: 'Thêm sản phẩm',
							url: '/dashboard/product/add',
						},
					],
				},
			},
			{
				path: ':slug',
				component: EidtProductPageComponent,
				data: {
					breadcrumb: [
						{
							label: 'Danh sách sản phẩm',
							url: '/dashboard/product',
						},
						{
							label: '{{slug}}',
							url: '/dashboard/product/:slug',
						},
					],
				},
			},
		],
	},
	{
		path: 'user',
		children: [
			{
				path: '',
				component: UserListPageComponent,
			},
			{
				path: ':id',
				component: UserDetailPageComponent,
				data: {
					breadcrumb: [
						{
							label: 'Danh sách người dùng',
							url: '/dashboard/user',
						},
						{
							label: 'Chi tiết người dùng',
							url: '/dashboard/user/:id',
						},
					],
				},
			},
		],
	},
	{
		path: 'order',
		children: [
			{
				path: '',
				component: OrderListPageComponent,
			},
			{
				path: ':id',
				component: OrderDetailPageComponent,
				data: {
					breadcrumb: [
						{
							label: 'Danh sách đơn hàng',
							url: '/dashboard/order',
						},
						{
							label: 'Chi tiết đơn hàng',
							url: '/dashboard/product/:id',
						},
					],
				},
			},
		],
	},
	{
		path: 'category',
		children: [
			{
				path: '',
				component: ListCategoryPageComponent,
			},
			{
				path: ':id',
				component: EidtCategoryPageComponent,
			},
		],
	},
	{
		path: 'color',
		children: [
			{
				path: '',
				component: ListColorPageComponent,
			},
			{
				path: ':id',
				component: EditColorPageComponent,
			},
		],
	},
	{
		path: 'capacity',
		children: [
			{
				path: '',
				component: ListCapacityPageComponent,
			},
			{
				path: ':id',
				component: EidtCapacityPageComponent,
			},
		],
	},
	{
		path: 'image',
		children: [
			{
				path: '',
				component: ListImagePageComponent,
			},
			{
				path: ':id',
				component: EditImagePageComponent,
			},
		],
	},
];
const dashboad = [DashboardPageComponent];
const product = [
	AddProductPageComponent,
	ListProductPageComponent,
	EidtProductPageComponent,
	FilterListProductComponent,
];
const category = [ListCategoryPageComponent, AddFormCategoryComponent, EidtCategoryPageComponent];
const color = [ListColorPageComponent, AddFormColorComponent, EditColorPageComponent];
const capacity = [ListCapacityPageComponent, AddCapacityFormComponent, EidtCapacityPageComponent];
const image = [ListImagePageComponent, AddImageFormComponent, EditImagePageComponent];
const order = [OrderListPageComponent];
@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		FlexLayoutModule,
		TaigaModule,
		ReactiveFormsModule,
		FormsModule,
		ImagePreviewExampleModule,
		AlertNotificationModule,
	],
	declarations: [
		dashboad,
		product,
		category,
		color,
		capacity,
		image,
		order,
		OrderDetailPageComponent,
		UserListPageComponent,
		UserDetailPageComponent,
  FilterOrderComponent,
	],
})
export class DashBoardModule {}
