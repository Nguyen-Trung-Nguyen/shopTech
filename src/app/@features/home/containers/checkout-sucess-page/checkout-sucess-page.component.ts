import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalStore } from 'src/app/@core/state/global.store';

@Component({
	selector: 'app-checkout-sucess-page',
	templateUrl: './checkout-sucess-page.component.html',
	styleUrls: ['./checkout-sucess-page.component.scss'],
})
export class CheckoutSucessPageComponent implements OnInit, OnDestroy {
	successCheckoutUrl: string = '/assets/image/success-check.png';

	constructor(private globalStore: GlobalStore) {}

	ngOnInit(): void {
		window.onbeforeunload = () => this.ngOnDestroy();
	}
	ngOnDestroy(): void {
		this.globalStore.update((state) => ({
			statusCheckout: false,
		}));
	}
}
