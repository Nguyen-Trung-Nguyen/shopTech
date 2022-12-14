import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TaigaModule } from 'src/app/@shared/taiga/taiga.module';
import { SigninFormComponent } from './components/form-signin/signin-form.component';
import { FormSignUpComponent } from './components/form-signup/form_signup.component';

import { Oauth2RedirectPageComponent } from './containers/oauth2-redirect-page/oauth2-redirect-page.component';
import { SigninPageComponent } from './containers/signin-page/signin-page.component';
import { SignupPageComponent } from './containers/signup-page/signup-page.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'dang-nhap',
		pathMatch: 'full',
	},
	{
		path: 'dang-nhap',
		component: SigninPageComponent,
	},
	{
		path: 'dang-ky',
		component: SignupPageComponent,
	},
	{
		path: 'oauth2/redirect',
		component: Oauth2RedirectPageComponent,
	},
];
@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		FlexLayoutModule,
		ReactiveFormsModule,
		TaigaModule,
	],
	declarations: [
		SigninPageComponent,
		SigninFormComponent,
		SignupPageComponent,
		FormSignUpComponent,
		Oauth2RedirectPageComponent,
	],
})
export class AuthModule {}
