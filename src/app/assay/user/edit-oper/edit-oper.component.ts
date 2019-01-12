import { Component, OnInit, Input, Injector } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base/modal-component-base';
import { EditAssayUserDto, Assay_UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-oper',
  templateUrl: './edit-oper.component.html',
  styles: []
})
export class EditAssayUserComponent extends ModalComponentBase {

  @Input()
  element: EditAssayUserDto;
  saving = false;

  constructor(
    injector: Injector,
    private _assayService: Assay_UserServiceProxy
  ) {
    super(injector);
  }
  save(): void {
    this.saving = true;

    this._assayService.update(this.element)
      .finally(() => {
        this.saving = false;
      })
      .subscribe((res: any) => {
        this.notify.info(res);
      });
  }

}
