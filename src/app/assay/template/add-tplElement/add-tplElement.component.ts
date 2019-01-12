import { Component, OnInit, Injector, Input, Output, EventEmitter } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';
import { HtmlSelectDto, Assay_UnitServiceProxy, Assay_TplServiceProxy, CreateTplElementDto, EditTplSpecimenDto, Assay_ElementServiceProxy, EditTplDto } from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { from } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-add-tpl-element',
  templateUrl: './add-tplElement.component.html',
  styles: []
})
export class AddTplElementComponent extends ModalComponentBase implements OnInit {
  @Input()
  specimen: EditTplSpecimenDto;
  @Input()
  listOfElement: HtmlSelectDto[];
  @Input()
  listOfUnit: HtmlSelectDto[];
  elementId;
  unitId;

  constructor(private injector: Injector, private _tplService: Assay_TplServiceProxy, private _eleService: Assay_ElementServiceProxy, private _unitService: Assay_UnitServiceProxy, public msg: NzMessageService) {
    super(injector);
  }

  ngOnInit() {
  }

  save() {
    if (!this.unitId || !this.elementId) {
      this.msg.warning("输入框不能为空!");
    } else {
      const input = new CreateTplElementDto();
      input.specId = this.specimen.specId;
      input.specName = this.specimen.specName;
      input.tplId = this.specimen.tplId;
      input.tplName = this.specimen.tplName;
      input.unitId = this.unitId;
      input.tplSpecId = this.specimen.id;

      from(this.listOfUnit).pipe(
        filter(x => x.key === this.unitId),
        take(1)
      ).subscribe(res => {
        input.unitName = res.value;
      });

      input.elementId = this.elementId;
      from(this.listOfElement).pipe(
        filter(x => x.key === this.elementId),
        take(1)
      ).subscribe(res => {
        input.elementName = res.value;
      });

      this._tplService.addTplElement(input).subscribe((res) => {
        this.notify.info(res);
      });
    }
  }

}
