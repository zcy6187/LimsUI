import { Component, OnInit, Input, Injector } from '@angular/core';
import { CreateConstDto, Assay_FormulaServiceProxy } from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { ModalComponentBase } from '@shared/component-base';

@Component({
  selector: 'app-constedit',
  templateUrl: './constedit.component.html',
  styles: []
})
export class ConsteditComponent extends ModalComponentBase implements OnInit {
  comptitle;
  @Input()
  editItem: CreateConstDto;

  constructor(private _service: Assay_FormulaServiceProxy,
    private _msg: NzMessageService,
    private injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    if (this.editItem.id > 0) {
      this.comptitle = "编辑";
    } else {
      this.comptitle = "添加";
    }
  }

  save() {
    if (this.editItem.id > 0) {
      this._service.editConst(this.editItem, this.editItem.id).subscribe((res) => {
        if (res.code > 0) {
          this._msg.info(res.message);
        } else {
          this._msg.warning(res.message);
        }
      })
    } else {
      this._service.addConst(this.editItem).subscribe((res) => {
        if (res.code > 0) {
          this._msg.info(res.message);
        } else {
          this._msg.warning(res.message);
        }
      })
    }
  }

}
