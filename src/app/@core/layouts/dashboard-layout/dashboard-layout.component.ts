import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardQuery } from 'src/app/@features/dashboard/main/state/dashboard.query';

@Component({
	selector: 'app-dashboard-layout',
	templateUrl: './dashboard-layout.component.html',
	styleUrls: ['./dashboard-layout.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent implements OnInit {
	expanedSidebar$: Observable<boolean>;
	constructor(private query: DashboardQuery) {}

	ngOnInit(): void {
		this.expanedSidebar$ = this.query.select('expanedSidebar');
	}
}
