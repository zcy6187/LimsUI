import { Component, Input, Injector } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base/modal-component-base';
import { UnitDto, Assay_UnitServiceProxy } from '@shared/service-proxies/service-proxies';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-unit',
  templateUrl: './edit-unit.component.html',
  styles: []
})
export class EditUnitComponent extends ModalComponentBase {

  @Input()
  instanceItem: UnitDto;
  saving = false;

  constructor(
    injector: Injector,
    private _assayService: Assay_UnitServiceProxy
  ) {
    super(injector);
  }

  save(): void {
    this.saving = true;

    this._assayService.update(this.instanceItem)
      .finally(() => {
        this.saving = false;
      })
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.success();
      });
  }

}
