import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiMoneyModule } from '@taiga-ui/addon-commerce';
import { TuiButtonModule, TuiLinkModule, TuiModeModule } from '@taiga-ui/core';
import { AlertNotificationComponent } from './alert-notification.component';

@NgModule({
	imports: [CommonModule, TuiModeModule, TuiButtonModule, TuiLinkModule, TuiMoneyModule],
	exports: [AlertNotificationComponent],
	declarations: [AlertNotificationComponent],
})
export class AlertNotificationModule {}
