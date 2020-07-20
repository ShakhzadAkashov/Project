import { Component, Injector, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import {
    HelpDeskDto,
    HelpDesksServiceProxy
} from '@shared/service-proxies/service-proxies';

@Component({
  templateUrl: 'create-helpdesk-dialog.component.html',
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
export class CreateHelpDeskDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  helpdesk: HelpDeskDto = new HelpDeskDto();

  constructor(
    injector: Injector,
    public _helpdeskService: HelpDesksServiceProxy,
    private _dialogRef: MatDialogRef<CreateHelpDeskDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  save(): void {
    this.saving = true;

    this._helpdeskService
      .create(this.helpdesk)
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