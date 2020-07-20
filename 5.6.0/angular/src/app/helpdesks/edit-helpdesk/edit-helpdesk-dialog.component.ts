import { Component, Injector, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import {
  HelpDesksServiceProxy,
  HelpDeskDto
} from '@shared/service-proxies/service-proxies';

@Component({
  templateUrl: 'edit-helpdesk-dialog.component.html',
  styles: [
    `
      mat-form-field {
        width: 100%;
      }
      mat-checkbox {
        padding-bottom: 5px;
      }
    `
  ]
})
export class EditHelpDeskDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  helpdesk: HelpDeskDto = new HelpDeskDto();

  constructor(
    injector: Injector,
    public _helpdeskService: HelpDesksServiceProxy,
    private _dialogRef: MatDialogRef<EditHelpDeskDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._helpdeskService.get(this._id).subscribe((result: HelpDeskDto) => {
      this.helpdesk = result;
    });
  }

  save(): void {
    this.saving = true;

    this._helpdeskService
      .update(this.helpdesk)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.close(true);
      });
  }

  close(result: any): void {
    this._dialogRef.close(result);
  }
}