import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of, startWith, switchMap, tap } from 'rxjs';
import { validateRequired } from 'src/app/@shared/validators/custom-validator';
import { AddressService } from '../../service/address.service';
import { UserQuery } from '../../state/user.query';
@Component({
	selector: 'app-address-form',
	templateUrl: './address-form.component.html',
	styleUrls: ['./address-form.component.scss'],
})
export class AddressFormComponent implements OnInit {
	informationForm: FormGroup;
	url: string = 'https://vapi.vnappmob.com/api/province/';
	provinces$: Observable<any>;
	districts$: Observable<any>;
	wards$: Observable<any>;
	readonly stringify = ({ name }: any): string => name;

	constructor(
		private fb: FormBuilder,
		private addressService: AddressService,
		private cookiService: CookieService,
		private userQuery: UserQuery
	) {}

	ngOnInit(): void {
		this.initFom();
		this.provinces$ = this.addressService.fetchProvinces(this.url);
		this.onProvinceChanges();
		this.onDistrictChanges();
	}

	initFom() {
		this.informationForm = this.fb.group({
			fullName: ['', [validateRequired]],
			phoneNumber: ['', [validateRequired]],
			province: [null, validateRequired],
			district: [null, validateRequired],
			ward: [null, validateRequired],
			detailAddress: ['', validateRequired],
		});
	}

	onProvinceChanges() {
		this.informationForm
			.get('province')
			.valueChanges.pipe(
				startWith(null),
				switchMap((province) => {
					if (province) {
						this.informationForm.get('district').enable();
						this.informationForm.get('district').setValue(null);
						const url = 'https://vapi.vnappmob.com/api/province/district/' + province.province_id;
						this.districts$ = this.addressService.fetchDistricts(url);
						return this.districts$;
					}
					this.informationForm.get('district').disable();
					this.informationForm.get('district').setValue(null);
					return of([]);
				})
			)
			.subscribe();
	}

	onDistrictChanges() {
		this.informationForm
			.get('district')
			.valueChanges.pipe(
				startWith(null),
				switchMap((district) => {
					if (district) {
						this.informationForm.get('ward').enable();
						this.informationForm.get('ward').setValue(null);
						const url = 'https://vapi.vnappmob.com/api/province/ward/' + district.district_id;
						this.wards$ = this.addressService.fetchWards(url);
						return this.wards$;
					}
					this.informationForm.get('ward').disable();
					this.informationForm.get('ward').setValue(null);
					return of([]);
				})
			)
			.subscribe();
	}
	updateInformation() {
		const compleAddress =
			this.informationForm.get('ward').value.name +
			', ' +
			this.informationForm.get('district').value.name +
			', ' +
			this.informationForm.get('province').value.name;
		const data = {
			fullName: this.informationForm.get('fullName').value,
			phoneNumber: this.informationForm.get('phoneNumber').value,
			detailAddress: this.informationForm.get('detailAddress').value,
			completeAddress: compleAddress,
		};
		this.addressService
			.createAddress(data)
			.pipe(
				tap((data) => {
					if (data) {
						this.addressService.getAll().subscribe();
						this.userQuery.setExpanedAddForm(false);
					}
				})
			)
			.subscribe();
	}
}
