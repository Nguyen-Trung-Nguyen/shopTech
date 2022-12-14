import { HttpErrorResponse } from '@angular/common/http';

export function handleError(error: HttpErrorResponse) {
	if (error.statusText === 'Unknown Error') {
		return {
			message: 'Lỗi kết tối nới server. Vui lòng thử lại sau!!',
		};
	} else {
		return error.error;
	}
}
