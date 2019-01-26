import { Component, OnInit, Injector, Input, Output, EventEmitter } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';
import { HtmlSelectDto, Assay_UnitServiceProxy, Assay_TplServiceProxy, CreateTplElementDto, EditTplSpecimenDto, Assay_ElementServiceProxy, EditTplDto, EditTplElementDto } from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { from } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-edit-tpl-element',
  templateUrl: './edit-tplElement.component.html',
  styles: []
})
export class EditTplElementComponent extends ModalComponentBase implements OnInit {
  @Input()
  item: EditTplElementDto;
  @Input()
  elementId;
  @Input()
  unitId;
  // @Input()
  listOfElement: HtmlSelectDto[];
  // @Input()
  listOfUnit: HtmlSelectDto[];

  constructor(private injector: Injector, private _tplService: Assay_TplServiceProxy, private _eleService: Assay_ElementServiceProxy, private _unitService: Assay_UnitServiceProxy, public msg: NzMessageService) {
    super(injector);
  }

  ngOnInit() {
    this._unitService.getHtmlSelectUnits()
      .subscribe(res => {
        this.listOfUnit = res;
      });

    this._eleService.getHtmlSelectElements()
      .subscribe(res => {
        this.listOfElement = res;
      });
  }

  save() {
    if (!this.unitId || !this.elementId) {
      this.msg.warning("输入框不能为空!");
    } else {
      const input = this.item;
      input.unitId = this.unitId;
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

      this._tplService.editTplElement(input).subscribe((res) => {
        this.notify.info(res);
      });
    }
  }

}
