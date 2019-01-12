import { Component, OnInit, Injector } from '@angular/core';
import { SpecimenDto, CreateSpecimenDto, Assay_SpecimenServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalComponentBase } from '@shared/component-base';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-create-specimen',
  templateUrl: './create-specimen.component.html',
  styles: []
})
export class CreateSpecimenComponent extends ModalComponentBase {

  item: CreateSpecimenDto = new CreateSpecimenDto();


  constructor(
    injector: Injector,
    private _assayBaseService: Assay_SpecimenServiceProxy,
    private msg: NzMessageService,
  ) {
    super(injector);
    console.log(this.l('specimen.add'));
  }

  save(): void {

    this._assayBaseService.add(this.item)
      .finally(() => { this.saving = false; })
      .subscribe((res) => {
        this.msg.info(res);
      });
  }



}
