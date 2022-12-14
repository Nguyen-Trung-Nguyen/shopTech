import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
	debounceTime,
	distinctUntilChanged,
	Observable,
	of,
	skip,
	startWith,
	switchMap,
	tap,
} from 'rxjs';
import { AddressService } from 'src/app/@features/user/service/address.service';
import { validateRequired } from 'src/app/@shared/validators/custom-validator';

@Component({
	selector: 'app-client-user-form',
	templateUrl: './client-user-form.component.html',
	styleUrls: ['./client-user-form.component.scss'],
})
export class ClientUserFormComponent implements OnInit {
	informationForm: FormGroup;
	url: string = 'https://vapi.vnappmob.com/api/province/';
	provinces$: Observable<any>;
	districts$: Observable<any>;
	wards$: Observable<any>;
	readonly stringify = ({ name }: any): string => name;

	@Output() newItemEvent = new EventEmitter<any>();
	constructor(private fb: FormBuilder, private addressService: AddressService) {}
	ngOnInit(): void {
		this.initForm();
		this.formChanges();
		this.provinces$ = this.addressService.fetchProvinces(this.url);
		this.onProvinceChanges();
		this.onDistrictChanges();
	}

	initForm() {
		this.informationForm = this.fb.group({
			email: ['', [validateRequired, Validators.email]],
			fullName: ['', validateRequired],
			phoneNumber: ['', validateRequired],
			province: [null, validateRequired],
			district: [null, validateRequired],
			ward: [null, validateRequired],
			detailAddress: ['', validateRequired],
		});
	}

	formChanges() {
		this.informationForm.valueChanges
			.pipe(
				skip(1),
				debounceTime(500),
				distinctUntilChanged(),
				tap((data) => {
					this.getInformation();
				})
			)
			.subscribe();
	}
	getInformation() {
		const infor = this.informationForm.value;
		var ward = '';
		var district = '';
		var province = '';
		if (infor.ward) {
			ward = infor.ward.name;
		}
		if (infor.district) {
			district = infor.district.name;
		}
		if (infor.province) {
			province = infor.province.name;
		}
		const compleAddress = ward + ', ' + district + ', ' + province;
		const clientUser = {
			email: this.informationForm.get('email').value,
			fullName: this.informationForm.get('fullName').value,
			phoneNumber: this.informationForm.get('phoneNumber').value,
			detailAddress: this.informationForm.get('detailAddress').value,
			completeAddress: compleAddress,
		};
		const data = {
			clientUser,
			disabled: this.informationForm.invalid,
		};
		this.newItemEvent.emit({
			data,
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
}
