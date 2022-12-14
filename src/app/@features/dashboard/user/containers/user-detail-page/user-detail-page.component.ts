import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DashboardUserStore } from '../../state/dashboard-user-store';
import { DashboardUserQuery } from '../../state/dashboard-user.query';
import { DashboardUserService } from '../../state/dashboard-user.service';
@Component({
	selector: 'app-user-detail-page',
	templateUrl: './user-detail-page.component.html',
	styleUrls: ['./user-detail-page.component.scss'],
})
export class UserDetailPageComponent implements OnInit {
	loading$: Observable<boolean>;
	user$: Observable<any>;
	editForm: FormGroup;
	constructor(
		private fb: FormBuilder,
		private service: DashboardUserService,
		private query: DashboardUserQuery,
		private store: DashboardUserStore,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.fetchInit();
		this.initValue();
	}

	fetchInit() {
		// this.activatedRoute.paramMap
		// 	.pipe(
		// 		switchMap((params) => {
		// 			let id = parseInt(params.get('id'));
		// 			return this.service.findById(id);
		// 		})
		// 	)
		// 	.subscribe();
	}
	initValue() {
		this.user$ = this.query.select('user');
		this.loading$ = this.query.select('loading');
	}

	update() {}
	ngOnDestroy(): void {
		this.store.reset();
	}
}
