import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TaigaModule } from 'src/app/@shared/taiga/taiga.module';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { EidtAddressFormComponent } from './components/eidt-address-form/eidt-address-form.component';
import { SidebarUserComponent } from './components/sidebar-user/sidebar-user.component';
import { AddressPageComponent } from './containers/address-page/address-page.component';
import { ProfilePageComponent } from './containers/profile-page/profile-page.component';
import { UserLayoutComponent } from './layout/user-layout/user-layout.component';

const routes: Routes = [
	{
		path: '',
		component: UserLayoutComponent,
		children: [
			{
				path: '',
				redirectTo: 'profile',
				pathMatch: 'full',
			},
			{
				path: 'profile',
				component: ProfilePageComponent,
			},
			{
				path: 'address',
				component: AddressPageComponent,
			},
		],
	},
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		FlexLayoutModule,
		TaigaModule,
		ReactiveFormsModule,
	],
	declarations: [
		ProfilePageComponent,
		UserLayoutComponent,
		SidebarUserComponent,
		AddressPageComponent,
		AddressFormComponent,
		EidtAddressFormComponent,
	],
})
export class UserModule {}
