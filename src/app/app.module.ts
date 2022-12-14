import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { persistState } from '@datorama/akita';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { TuiTableBarsHostModule } from '@taiga-ui/addon-tablebars';
import {
	TuiAlertModule,
	TuiNotificationModule,
	TuiRootModule,
	TUI_SANITIZER,
} from '@taiga-ui/core';
import { TUI_LANGUAGE, TUI_VIETNAMESE_LANGUAGE } from '@taiga-ui/i18n';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { CookieService } from 'ngx-cookie-service';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CoreModule } from './@core/core.module';
import { authInterceptorProviders } from './@core/interceptor/auth.interceptor';
import { errorInterceptorProviders } from './@core/interceptor/error.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		AppRoutingModule,
		CoreModule,
		environment.production ? [] : AkitaNgDevtools.forRoot(),
		TuiNotificationModule,
		TuiAlertModule,
		TuiRootModule,
		TuiTableBarsHostModule,
	],
	providers: [
		{
			provide: TUI_LANGUAGE,
			useValue: of(TUI_VIETNAMESE_LANGUAGE),
		},
		{
			provide: TUI_SANITIZER,
			useClass: NgDompurifySanitizer,
		},
		authInterceptorProviders,
		errorInterceptorProviders,
		CookieService,
	],
	bootstrap: [AppComponent],
})
export class AppModule {}

export const globalPersistStorage = persistState({
	include: ['global'],
	key: 'global',
});

const providers = [{ provide: 'persistStorage', useValue: globalPersistStorage, multi: true }];
platformBrowserDynamic(providers)
	.bootstrapModule(AppModule)
	.catch((err) => console.log(err));
