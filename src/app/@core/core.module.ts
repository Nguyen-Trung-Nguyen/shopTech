import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgDynamicBreadcrumbModule } from 'ng-dynamic-breadcrumb';
import { TaigaModule } from '../@shared/taiga/taiga.module';
import { FooterComponent } from './components/footer/footer.component';
import { MenuDashboardComponent } from './components/menu-dashboard/menu-dashboard.component';
import { MenuComponent } from './components/menu/menu.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SideBarDashboardComponent } from './components/side-bar-dashboard/side-bar-dashboard.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { NotificationComponent } from './components/notification/notification.component';
import { InputSearchComponent } from './components/input-search/input-search.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FlexLayoutModule,
		ReactiveFormsModule,
		TaigaModule,
		FormsModule,
		NgDynamicBreadcrumbModule,
	],
	declarations: [
		MenuComponent,
		MainLayoutComponent,
		DashboardLayoutComponent,
		SideBarComponent,
		MenuDashboardComponent,
		SideBarDashboardComponent,
		FooterComponent,
		PageNotFoundComponent,
  NotificationComponent,
  InputSearchComponent,
	],
	exports: [],
})
export class CoreModule {}
