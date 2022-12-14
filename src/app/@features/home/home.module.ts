import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CheckoutSuccessGuard } from 'src/app/@core/guard/checkout-sucess.guard';
import { CheckoutGuard } from 'src/app/@core/guard/checkout.guard';
import { TruncatePipe } from 'src/app/@core/pipe/truncate.pipe';
import { ImagePreviewExampleModule } from 'src/app/@shared/component/image-preview-example/image-preview-example.module';
import { TaigaModule } from 'src/app/@shared/taiga/taiga.module';
import { ClientUserFormComponent } from './components/client-user-form/client-user-form.component';
import { ListPhoneComponent } from './components/list-phone/list-phone.component';
import { CartPageComponent } from './containers/cart-page/cart-page.component';
import { CategoryProductPageComponent } from './containers/category-product-page/category-product-page.component';
import { CheckoutPageComponent } from './containers/checkout-page/checkout-page.component';
import { CheckoutSucessPageComponent } from './containers/checkout-sucess-page/checkout-sucess-page.component';
import { HomePageComponent } from './containers/home-page/home-page.component';
import { ProductDetailPageComponent } from './containers/product-detail-page/product-detail-page.component';
import { SearchResultPageComponent } from './containers/search-result-page/search-result-page.component';

const routes: Routes = [
	{
		path: 'home',
		redirectTo: '',
	},
	{
		path: '',
		component: HomePageComponent,
	},
	{
		path: 'home/:category',
		component: CategoryProductPageComponent,
		data: {
			breadcrumb: [
				{
					label: 'Home',
					url: '/home',
				},
				{
					label: '{{category}}',
					url: '/home/:category',
				},
			],
			title: 'Danh mục sản phẩm',
		},
	},
	{
		path: 'home/:category/:slug',
		component: ProductDetailPageComponent,
		data: {
			breadcrumb: [
				{
					label: 'Home',
					url: '/',
				},
				{
					label: '{{category}}',
					url: '/home/:category',
				},
				{
					label: '{{slug}}',
					url: '/home/:category/:slug',
				},
			],
			title: 'Chi tiết sản phẩm',
		},
	},
	{
		path: 'search',
		component: SearchResultPageComponent,
		data: {
			title: 'Tìm kiếm...',
		},
	},
	{
		path: 'cart',
		component: CartPageComponent,
		data: {
			title: 'Giỏ hàng',
		},
	},
	{
		path: 'checkout',
		component: CheckoutPageComponent,
		data: {
			title: 'Thanh toán giỏ hàng',
		},
		canActivate: [CheckoutGuard],
	},
	{
		path: 'checkout/success',
		component: CheckoutSucessPageComponent,
		data: {
			title: 'Hoàn tất',
		},
		canActivate: [CheckoutSuccessGuard],
	},
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		ReactiveFormsModule,
		FormsModule,
		FlexLayoutModule,
		TaigaModule,
		InfiniteScrollModule,
		ImagePreviewExampleModule,
	],
	declarations: [
		HomePageComponent,
		CategoryProductPageComponent,
		ProductDetailPageComponent,
		TruncatePipe,
		SearchResultPageComponent,
		ListPhoneComponent,
		CartPageComponent,
		CheckoutPageComponent,
		ClientUserFormComponent,
		CheckoutSucessPageComponent,
	],
})
export class HomeModule {}
