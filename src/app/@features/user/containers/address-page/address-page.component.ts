import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	OnDestroy,
	OnInit,
	ViewChild,
} from '@angular/core';
import { TuiTableBarsService } from '@taiga-ui/addon-tablebars';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Observable, Subscription, switchMap } from 'rxjs';
import { AddressService } from '../../service/address.service';
import { UserQuery } from '../../state/user.query';
import { UserStore } from '../../state/user.store';
@Component({
	selector: 'app-address-page',
	templateUrl: './address-page.component.html',
	styleUrls: ['./address-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressPageComponent implements OnInit, OnDestroy {
	@ViewChild(`tableBarTemplate`)
	tableBarTemplate: PolymorpheusContent = ``;
	fullname: string = '';
	phoneNumber: number = 0;
	loading$: Observable<boolean>;
	address$: Observable<any>;
	expanedAddressForm$: Observable<boolean>;
	expanedEditAddressForm$: Observable<boolean>;
	subscriptionTableBar = new Subscription();
	id: number = 0;
	constructor(
		private userQuery: UserQuery,
		private userStore: UserStore,
		private addressService: AddressService,
		@Inject(TuiTableBarsService)
		private tableBarsService: TuiTableBarsService
	) {}

	ngOnInit(): void {
		this.addressService.getAll().subscribe();
		this.initValue();
	}

	initValue() {
		this.loading$ = this.userQuery.select('loading');
		this.address$ = this.userQuery.select('address');
		this.expanedAddressForm$ = this.userQuery.select('expanedAddressForm');
		this.expanedEditAddressForm$ = this.userQuery.select('expanedEditAddressForm');
	}

	showAddForm() {
		this.userQuery.toggleAddform();
	}
	showEditForm(id: number) {
		this.id = id;
		this.userQuery.toggleEditAddressForm();
	}
	remove() {
		this.addressService.deleteById(this.id).subscribe();
		this.subscriptionTableBar.unsubscribe();
	}
	showTableBar(id: number) {
		if (id) this.id = id;
		this.subscriptionTableBar = this.tableBarsService
			.open(this.tableBarTemplate || ``, {
				hasCloseButton: true,
			})
			.subscribe();
	}
	setDefault(id: number) {
		this.addressService
			.setDefault(id)
			.pipe(
				switchMap((data) => {
					return this.addressService.getAll();
				})
			)
			.subscribe();
	}
	ngOnDestroy(): void {
		this.userStore.reset();
	}
}
