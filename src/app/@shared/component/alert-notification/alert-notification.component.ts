import { Component, Inject, OnInit } from '@angular/core';
import { TuiDialog } from '@taiga-ui/cdk';
import { TuiAlertOptions } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
@Component({
	selector: 'app-alert-notification',
	templateUrl: './alert-notification.component.html',
	styleUrls: ['./alert-notification.component.scss'],
})
export class AlertNotificationComponent implements OnInit {
	error: any;
	data: any;
	constructor(
		@Inject(POLYMORPHEUS_CONTEXT)
		private readonly context: TuiDialog<TuiAlertOptions<any>, any>
	) {
		this.data = this.context.data;
		this.error = this.data.error;
	}
	ngOnInit(): void {}
}
