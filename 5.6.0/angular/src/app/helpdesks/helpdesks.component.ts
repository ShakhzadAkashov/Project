import { Component, Injector } from '@angular/core';
// import { MatDialog } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
    PagedListingComponentBase, PagedRequestDto, PagedResultDto,
} from 'shared/paged-listing-component-base';
import {
    HelpDesksServiceProxy,
    HelpDeskDto,
    HelpDeskDtoPagedResultDto
} from '@shared/service-proxies/service-proxies';
import { CreateHelpDeskDialogComponent } from './create-helpdesk/create-helpdesk-dialog.component';
import { EditHelpDeskDialogComponent } from './edit-helpdesk/edit-helpdesk-dialog.component';

class PagedHelpDeskRequestDto extends PagedRequestDto
{
    keyword:string;
}

@Component({
    templateUrl: './helpdesks.component.html',
    animations: [appModuleAnimation()]
    // styles: [
    //     `
    //       mat-form-field {
    //         padding: 10px;
    //       }
    //     `
    //   ]
})
export class HelpDesksComponent extends PagedListingComponentBase<HelpDeskDto> {
    helpdesks: HelpDeskDto[] = [];
    keyword = '';
    // isActive: boolean | null;

    constructor(
        injector: Injector,
        private _helpdeskService: HelpDesksServiceProxy,
        // private _dialog: MatDialog
        private _modalService : BsModalService
    ) {
        super(injector);
    }

    list(
        // request: PagedRequestDto,
        request: PagedHelpDeskRequestDto,
        pageNumber: number,
        finishedCallback: Function
    ): void {
        request.keyword = this.keyword;
        this._helpdeskService
            // .getAll('', request.skipCount, request.maxResultCount)
            .getAll(request.keyword, request.skipCount, request.maxResultCount)
            .pipe(
                finalize(() => {
                    finishedCallback();
                })
            )
            .subscribe((result: HelpDeskDtoPagedResultDto) => {
                this.helpdesks = result.items;
                this.showPaging(result, pageNumber);
            });
    }

    delete(helpdesk: HelpDeskDto): void {
        abp.message.confirm(
            this.l('HelpDeskDeleteWarningMessage', helpdesk.name),
            undefined,
            (result: boolean) => {
                if (result) {
                    this._helpdeskService
                        .delete(helpdesk.id)
                        .pipe(
                            finalize(() => {
                                abp.notify.success(this.l('SuccessfullyDeleted'));
                                this.refresh();
                            })
                        )
                        .subscribe(() => { });
                }
            }
        );
    }

    createHelpDesk(): void {
        this.showCreateOrEditHelpDeskDialog();
    }

    editHelpDesk(helpdesk: HelpDeskDto): void {
        this.showCreateOrEditHelpDeskDialog(helpdesk.id);
    }

    showCreateOrEditHelpDeskDialog(id?: number): void {
        // let createOrEditHelpDeskDialog;
        let createOrEditHelpDeskDialog : BsModalRef;
        // if (id === undefined || id <= 0) 
        if(!id)
        {
            // createOrEditHelpDeskDialog = this._dialog.open(CreateHelpDeskDialogComponent);
            createOrEditHelpDeskDialog = this._modalService.show(CreateHelpDeskDialogComponent,
                { 
                    class: 'modal-lg',
                });
        } else {
            // createOrEditHelpDeskDialog = this._dialog.open(EditHelpDeskDialogComponent, {
            //     data: id
            // });
            createOrEditHelpDeskDialog = this._modalService.show(EditHelpDeskDialogComponent,
                {
                    class: 'modal-lg',
                    initialState:
                    {
                        id:id,
                    },
                });
        }

        // createOrEditHelpDeskDialog.afterClosed().subscribe(result => {
        //     if (result) {
        //         this.refresh();
        //     }
        // });
        createOrEditHelpDeskDialog.content.onSave.subscribe(()=>
        {
            this.refresh();
        });
    }
}
