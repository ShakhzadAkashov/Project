// import { Component, Injector, OnInit, Inject, Optional } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { finalize } from 'rxjs/operators';
// import { AppComponentBase } from '@shared/app-component-base';
// import {
//   HelpDesksServiceProxy,
//   HelpDeskDto
// } from '@shared/service-proxies/service-proxies';

// @Component({
//   templateUrl: 'edit-helpdesk-dialog.component.html',
//   styles: [
//     `
//       mat-form-field {
//         width: 100%;
//       }
//       mat-checkbox {
//         padding-bottom: 5px;
//       }
//     `
//   ]
// })
// export class EditHelpDeskDialogComponent extends AppComponentBase
//   implements OnInit {
//   saving = false;
//   helpdesk: HelpDeskDto = new HelpDeskDto();

//   constructor(
//     injector: Injector,
//     public _helpdeskService: HelpDesksServiceProxy,
//     private _dialogRef: MatDialogRef<EditHelpDeskDialogComponent>,
//     @Optional() @Inject(MAT_DIALOG_DATA) private _id: number
//   ) {
//     super(injector);
//   }

//   ngOnInit(): void {
//     this._helpdeskService.get(this._id).subscribe((result: HelpDeskDto) => {
//       this.helpdesk = result;
//     });
//   }

//   save(): void {
//     this.saving = true;

//     this._helpdeskService
//       .update(this.helpdesk)
//       .pipe(
//         finalize(() => {
//           this.saving = false;
//         })
//       )
//       .subscribe(() => {
//         this.notify.info(this.l('SavedSuccessfully'));
//         this.close(true);
//       });
//   }

//   close(result: any): void {
//     this._dialogRef.close(result);
//   }
// }


import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as _ from 'lodash';
import { AppComponentBase } from '@shared/app-component-base';
import {
  HelpDesksServiceProxy,
  GetHelpDeskForEditOutput,
  HelpDeskDto,
  HelpDeskPermissionDto,
  HelpDeskEditDto,
  FlatPermissionDto
} from '@shared/service-proxies/service-proxies';

@Component({
  templateUrl: 'edit-helpdesk-dialog.component.html'
})
export class EditHelpDeskDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  id: number;
  role = new HelpDeskEditDto();
  permissions: FlatPermissionDto[];
  grantedPermissionNames: string[];
  checkedPermissionsMap: { [key: string]: boolean } = {};

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _roleService: HelpDesksServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._roleService
      .getHelpDeskForEdit(this.id)
      .subscribe((result: GetHelpDeskForEditOutput) => {
        this.role = result.helpdesk;
        this.permissions = result.permissions;
        this.grantedPermissionNames = result.grantedPermissionNames;
        this.setInitialPermissionsStatus();
      });
  }

  setInitialPermissionsStatus(): void {
    _.map(this.permissions, (item) => {
      this.checkedPermissionsMap[item.name] = this.isPermissionChecked(
        item.name
      );
    });
  }

  isPermissionChecked(permissionName: string): boolean {
    return _.includes(this.grantedPermissionNames, permissionName);
  }

  onPermissionChange(permission: HelpDeskPermissionDto, $event) {
    this.checkedPermissionsMap[permission.name] = $event.target.checked;
  }

  getCheckedPermissions(): string[] {
    const permissions: string[] = [];
    _.forEach(this.checkedPermissionsMap, function (value, key) {
      if (value) {
        permissions.push(key);
      }
    });
    return permissions;
  }

  save(): void {
    this.saving = true;

    const role = new HelpDeskDto();
    role.init(this.role);
    role.grantedPermissions = this.getCheckedPermissions();

    this._roleService
      .update(role)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      });
  }
}
