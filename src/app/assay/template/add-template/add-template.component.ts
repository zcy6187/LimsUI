import { Component, OnInit, Injector, Input, Output, EventEmitter } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';
import { Assay_TplServiceProxy, CreateTplDto, OrgTreeNodeDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styles: []
})
export class AddTemplateComponent extends ModalComponentBase implements OnInit {
  @Input()
  orgCode: string;
  @Input()
  orgList: OrgTreeNodeDto[];
  public item: CreateTplDto;


  constructor(private injector: Injector, private _service: Assay_TplServiceProxy) {
    super(injector);
    this.item = new CreateTplDto();
  }

  ngOnInit() {
    this.item = new CreateTplDto();
    this.item.orgCode = this.orgCode;
  }

  save() {
    if (this.item.tplName) {
      this._service.addTpl(this.item)
        .subscribe((res) => {
          this.notify.info(res);
        });
    }
  }

}
