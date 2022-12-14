import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'app-side-bar',
	templateUrl: './side-bar.component.html',
	styleUrls: ['./side-bar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideBarComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
