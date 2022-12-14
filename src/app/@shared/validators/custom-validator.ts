import { AbstractControl, Form, FormControl } from '@angular/forms';

export function validateSpecialChacracter(control: FormControl) {
	let pattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/; // can change regex with your requirement
	//if validation fails, return error name & value of true
	if (pattern.test(control.value)) {
		return { validString: 'Vui lòng không nhập các kí tự đặc biệt' };
	}

	return null;
}
export function validateRequired(control: FormControl) {
	if (control.value === '' || !control.value || control.invalid) {
		return {
			validString: 'Trường này bắt buộc nhập*',
		};
	}
	return null;
}
export function noWhitespaceValidator(control: FormControl) {
	const isSpace = (control.value || '').match(/\s/g);
	return isSpace ? { validString: 'Vui lòng không nhập khoảng trắng' } : null;
}
