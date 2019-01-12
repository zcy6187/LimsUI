import { Component, OnInit, Input, Injector } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base/modal-component-base';
import { ElementDto, Assay_ElementServiceProxy } from '@shared/service-proxies/service-proxies';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-element',
  templateUrl: './edit-element.component.html',
  styles: []
})
export class EditElementComponent extends ModalComponentBase {

  @Input()
  element: ElementDto;
  saving = false;

  constructor(
    injector: Injector,
    private _assayService: Assay_ElementServiceProxy
  ) {
    super(injector);
  }
  save(): void {
    this.saving = true;

    this._assayService.updateElement(this.element)
      .finally(() => {
        this.saving = false;
      })
      .subscribe((res) => {
        this.notify.info(res);
      });
  }

}
