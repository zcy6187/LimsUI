import { Component, OnInit, Input, Injector } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base/modal-component-base';
import { SpecimenDto, Assay_SpecimenServiceProxy } from '@shared/service-proxies/service-proxies';
import { Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-edit-specimen',
  templateUrl: './edit-specimen.component.html',
  styles: []
})
export class EditSpecimenComponent extends ModalComponentBase {

  @Input()
  instanceItem: SpecimenDto;
  saving = false;

  constructor(
    injector: Injector,
    private _assayService: Assay_SpecimenServiceProxy,
    private msg: NzMessageService,
  ) {
    super(injector);
  }

  save(): void {
    this.saving = true;

    this._assayService.update(this.instanceItem)
      .finally(() => {
        this.saving = false;
      })
      .subscribe((res) => {
        this.msg.info(res);
      });
  }

}
