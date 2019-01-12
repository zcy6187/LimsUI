import { Component, OnInit, Injector, Input, Output, EventEmitter } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';
import { Assay_TplServiceProxy, EditTplDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styles: []
})
export class EditTemplateComponent extends ModalComponentBase implements OnInit {

  @Input()
  item: EditTplDto;


  constructor(private injector: Injector, private _service: Assay_TplServiceProxy) {
    super(injector);
  }

  ngOnInit() {
  }

  save() {
    if (this.item.tplName) {
      this._service.editTpl(this.item)
        .subscribe((res) => {
          this.notify.info(res);
        });
    }
  }

}
