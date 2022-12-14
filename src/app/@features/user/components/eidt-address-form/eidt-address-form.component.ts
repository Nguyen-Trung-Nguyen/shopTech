import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of, startWith, switchMap, tap } from 'rxjs';
import { validateRequired } from 'src/app/@shared/validators/custom-validator';
import { AddressService } from '../../service/address.service';
import { UserQuery } from '../../state/user.query';
@Component({
	selector: 'app-eidt-address-form',
	templateUrl: './eidt-address-form.component.html',
	styleUrls: ['./eidt-address-form.component.scss'],
})
export class EidtAddressFormComponent implements OnInit {
	@Input() id: number = 0;
	editForm: FormGroup;
	url: string = 'https://provinces.open-api.vn/api/p/';
	provinces$: Observable<any>;
	districts$: Observable<any>;
	wards$: Observable<any>;
	completeAddress: string = '';
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
		this.editForm = this.fb.group({
			fullName: ['', [validateRequired]],
			phoneNumber: ['', [validateRequired]],
			province: [null],
			district: [null],
			ward: [null],
			detailAddress: ['', validateRequired],
			completeAddress: [''],
		});
		this.addressService
			.findById(this.id)
			.pipe(
				tap((data) => {
					if (data) {
						this.editForm.patchValue(data);
						this.completeAddress = data.completeAddress;
					}
				})
			)
			.subscribe();
	}

	onProvinceChanges() {
		this.editForm
			.get('province')
			.valueChanges.pipe(
				startWith(null),
				switchMap((province) => {
					if (province) {
						this.editForm.get('district').enable();
						this.editForm.get('district').setValue(null);
						const url = 'https://provinces.open-api.vn/api/p/' + province.code + '?depth=2';
						this.districts$ = this.addressService.fetchDistricts(url);
						return this.districts$;
					}
					this.editForm.get('district').disable();
					this.editForm.get('district').setValue(null);
					return of([]);
				})
			)
			.subscribe();
	}

	onDistrictChanges() {
		this.editForm
			.get('district')
			.valueChanges.pipe(
				startWith(null),
				switchMap((district) => {
					if (district) {
						this.editForm.get('ward').enable();
						this.editForm.get('ward').setValue(null);
						const url = 'https://provinces.open-api.vn/api/d/' + district.code + '?depth=2';
						this.wards$ = this.addressService.fetchWards(url);
						return this.wards$;
					}
					this.editForm.get('ward').disable();
					this.editForm.get('ward').setValue(null);
					return of([]);
				})
			)
			.subscribe();
	}

	setCompleteAddress() {
		var ward = '';
		var district = '';
		var province = '';
		if (this.editForm.get('ward').value) {
			ward = this.editForm.get('ward').value.name;
		}
		if (this.editForm.get('district').value) {
			district = this.editForm.get('district').value.name;
		}
		if (this.editForm.get('province').value) {
			province = this.editForm.get('province').value.name;
		}

		this.completeAddress = ward + ', ' + district + ', ' + province;
		this.editForm.get('completeAddress').setValue(this.completeAddress);
	}

	update() {
		const data = {
			fullName: this.editForm.get('fullName').value,
			phoneNumber: this.editForm.get('phoneNumber').value,
			detailAddress: this.editForm.get('detailAddress').value,
			completeAddress: this.completeAddress,
		};
		this.addressService
			.updateAddress(this.id, data)
			.pipe(
				tap((data) => {
					if (data) {
						this.addressService.getAll().subscribe();
						this.userQuery.setExpanedEditAddressForm(false);
					}
				})
			)
			.subscribe();
	}

	cancelForm() {
		this.userQuery.setExpanedEditAddressForm(false);
	}
}
