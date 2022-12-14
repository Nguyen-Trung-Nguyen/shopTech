import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function createPasswordStrengthValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value;

		if (!value) return null;

		const hasUpperCase = /[A-Z]+/.test(value);
		const hasLowerCase = /[a-z]+/.test(value);
		const hasNumeric = /[0-9]+/.test(value);
		const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;
		return !passwordValid ? { passwordStrength: true } : null;
	};
}

export function passwordValidator(field: AbstractControl): ValidationErrors | null {
	const value = field.value;
	if (!value) return null;
	const hasUpperCase = /[A-Z]+/.test(value);
	const hasLowerCase = /[a-z]+/.test(value);
	const hasNumeric = /[0-9]+/.test(value);
	const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;
	return passwordValid
		? null
		: {
				maybe: 'Vui lòng nhập mật khẩu dài 6-32 ký tự, bao gồm chữ hoa, chữ thường, và số',
		  };
}
export function checkPasswords(field: AbstractControl): ValidationErrors | null {
	let pass = field.get('password').value;
	let confirmPass = field.get('confirmPassword').value;
	return pass == confirmPass ? null : { notSame: 'Mật khẩu không khớp' };
}

export function ConfirmedValidator(controlName: string, matchingControlName: string) {
	return (formGroup: FormGroup) => {
		const control = formGroup.controls[controlName];
		const matchingControl = formGroup.controls[matchingControlName];
		if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
			return;
		}
		if (control.value !== matchingControl.value) {
			matchingControl.setErrors({ confirmedValidator: 'Mật khẩu không khớp' });
		} else {
			matchingControl.setErrors(null);
		}
	};
}
