import { Component, OnInit, Injector } from '@angular/core';
import { ElementDto, CreateElementDto, Assay_ElementServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalComponentBase } from '@shared/component-base';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-create-element',
  templateUrl: './create-element.component.html',
  styles: []
})
export class CreateElementComponent extends ModalComponentBase {

  element: CreateElementDto = new CreateElementDto();


  constructor(
    injector: Injector,
    private _assayBaseService: Assay_ElementServiceProxy,
    private msg: NzMessageService
  ) {
    super(injector);
  }

  save(): void {
    this._assayBaseService.addElement(this.element)
      .finally(() => { this.saving = false; })
      .subscribe((res) => {
        this.msg.info(res);
      });
  }

}
