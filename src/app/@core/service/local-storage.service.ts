import { Injectable } from '@angular/core';

const TOKEN_KEY = 'access-token';
const REFRESH_TOKEN_KEY = 'refresh-token';
@Injectable({
	providedIn: 'root',
})
export class LocalStorageService {
	constructor() {}

	public saveToken(token: string): void {
		window.localStorage.removeItem(TOKEN_KEY);
		window.localStorage.setItem(TOKEN_KEY, token);
	}

	public getToken(): string | null {
		return window.localStorage.getItem(TOKEN_KEY);
	}
	public saveRefreshToken(token: string): void {
		window.localStorage.removeItem(REFRESH_TOKEN_KEY);
		window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
	}

	public getRefreshToken(): string | null {
		return window.localStorage.getItem(REFRESH_TOKEN_KEY);
	}
	public deleteAllToken() {
		window.localStorage.removeItem(REFRESH_TOKEN_KEY);
		window.localStorage.removeItem(TOKEN_KEY);
	}
	public setItem(key: string, data: string): void {
		window.localStorage.removeItem(key);
		window.localStorage.setItem(key, data);
	}
	public getItem(key: string): string | null {
		return window.localStorage.getItem(key);
	}
	public removeItem(key: string): void {
		window.localStorage.removeItem(key);
	}
}
