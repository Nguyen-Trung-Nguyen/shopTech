import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
