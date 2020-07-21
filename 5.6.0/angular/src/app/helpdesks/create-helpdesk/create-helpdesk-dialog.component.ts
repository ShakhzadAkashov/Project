// import { Component, Injector, OnInit } from '@angular/core';
// import { MatDialogRef } from '@angular/material';
// import { finalize } from 'rxjs/operators';
// import { AppComponentBase } from '@shared/app-component-base';
// import {
//     HelpDeskDto,
//     HelpDesksServiceProxy
// } from '@shared/service-proxies/service-proxies';

// @Component({
//   templateUrl: 'create-helpdesk-dialog.component.html',
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
// export class CreateHelpDeskDialogComponent extends AppComponentBase
//   implements OnInit {
//   saving = false;
//   helpdesk: HelpDeskDto = new HelpDeskDto();

//   constructor(
//     injector: Injector,
//     public _helpdeskService: HelpDesksServiceProxy,
//     private _dialogRef: MatDialogRef<CreateHelpDeskDialogComponent>
//   ) {
//     super(injector);
//   }

//   ngOnInit(): void {
//   }

//   save(): void {
//     this.saving = true;

//     this._helpdeskService
//       .create(this.helpdesk)
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
  HelpDeskDto,
  PermissionDto,
  CreateHelpDeskDto,
  PermissionDtoListResultDto
} from '@shared/service-proxies/service-proxies';

@Component({
  templateUrl: 'create-helpdesk-dialog.component.html'
})
export class CreateHelpDeskDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  role = new HelpDeskDto();
  permissions: PermissionDto[] = [];
  checkedPermissionsMap: { [key: string]: boolean } = {};
  defaultPermissionCheckedStatus = true;

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
      .getAllPermissions()
      .subscribe((result: PermissionDtoListResultDto) => {
        this.permissions = result.items;
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
    // just return default permission checked status
    // it's better to use a setting
    return this.defaultPermissionCheckedStatus;
  }

  onPermissionChange(permission: PermissionDto, $event) {
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

    const role = new CreateHelpDeskDto();
    role.init(this.role);

    this._roleService
      .create(role)
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






