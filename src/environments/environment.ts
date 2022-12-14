// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	API_URL_AUTH: 'http://localhost:8080/api/auth',
	API_URL_BASE: 'http://localhost:8080/api/v1',
	imgbb: {
		host: 'https://api.imgbb.com/1/upload',
		apiKey: '8dbd58800cf55cb9c145b69c535afaff',
	},
	SOCKET_END_POINT: 'http://localhost:8080/ws',
	GOOGLE_AUTH_URL: 'http://localhost:8080/oauth2/authorize/google',
	FACEBOOK_AUTH_URL: 'http://localhost:8080/oauth2/authorize/facebook',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
