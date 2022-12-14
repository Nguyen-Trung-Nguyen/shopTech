import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './@core/components/page-not-found/page-not-found.component';
import { AuthAdminGuard } from './@core/guard/auth-admin.guard';
import { AuthGuard } from './@core/guard/auth.guard';
import { UserGuard } from './@core/guard/user.guard';
import { DashboardLayoutComponent } from './@core/layouts/dashboard-layout/dashboard-layout.component';
import { MainLayoutComponent } from './@core/layouts/main-layout/main-layout.component';

const routes: Routes = [
	{
		path: '',
		component: MainLayoutComponent,
		children: [
			{
				path: '',
				loadChildren: () => import('./@features/home/home.module').then((m) => m.HomeModule),
			},
			{
				path: 'auth',
				loadChildren: () => import('./@features/auth/auth.module').then((m) => m.AuthModule),
				canLoad: [AuthGuard],
			},
			{
				path: 'user',
				loadChildren: () => import('./@features/user/user.module').then((m) => m.UserModule),
				canLoad: [UserGuard],
			},
		],
	},
	{
		path: '',
		component: DashboardLayoutComponent,
		children: [
			{
				path: 'dashboard',
				loadChildren: () =>
					import('./@features/dashboard/dashboard.module').then((m) => m.DashBoardModule),
				data: {
					title: 'Trang quản trị',
				},
				canLoad: [AuthAdminGuard],
			},
		],
	},
	{
		path: '404',
		component: PageNotFoundComponent,
	},

	{
		path: '**',
		pathMatch: 'full',
		component: PageNotFoundComponent,
		data: {
			title: 'ERROR 404',
		},
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
