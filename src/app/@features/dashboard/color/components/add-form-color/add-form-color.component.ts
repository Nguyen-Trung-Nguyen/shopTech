import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { defaultEditorColors } from '@taiga-ui/addon-editor';
import { Subject, takeUntil, tap } from 'rxjs';
import {
	validateRequired,
	validateSpecialChacracter,
} from 'src/app/@shared/validators/custom-validator';
import { ColorQuery } from '../../state/color.query';
import { ColorService } from '../../state/color.service';

@Component({
	selector: 'app-add-form-color',
	templateUrl: './add-form-color.component.html',
	styleUrls: ['./add-form-color.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddFormColorComponent implements OnInit, OnDestroy {
	addForm: FormGroup;
	unsubscribeSubject$ = new Subject();
	readonly palette = defaultEditorColors;
	color = `#ffdd2d`;
	constructor(private fb: FormBuilder, private query: ColorQuery, private service: ColorService) {}

	ngOnInit(): void {
		this.initFom();
	}

	initFom() {
		this.addForm = this.fb.group({
			name: ['', [validateRequired, Validators.maxLength(20), validateSpecialChacracter]],
			hex: [this.color],
		});
	}
	create() {
		this.service
			.create(this.addForm.value)
			.pipe(
				tap((data) => {
					if (data) {
						this.service.getAll().pipe(takeUntil(this.unsubscribeSubject$)).subscribe();
						this.query.setExpanedAddForm(false);
					}
				}, takeUntil(this.unsubscribeSubject$))
			)
			.subscribe();
	}

	ngOnDestroy() {
		this.unsubscribeSubject$.next(0);
		this.unsubscribeSubject$.unsubscribe();
	}
}
