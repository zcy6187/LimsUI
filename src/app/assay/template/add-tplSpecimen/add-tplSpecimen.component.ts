import { Component, OnInit, Injector, Input, Output, EventEmitter } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';
import { EditTplDto, HtmlSelectDto, Assay_SpecimenServiceProxy, Assay_UnitServiceProxy, Assay_TplServiceProxy, CreateTplSpecimenDto } from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { from } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-add-tpl-specimen',
  templateUrl: './add-tplSpecimen.component.html',
  styles: []
})
export class AddTplSpecimenComponent extends ModalComponentBase implements OnInit {
  @Input()
  template: EditTplDto;
  @Input()
  listOfSpecimen: HtmlSelectDto[];
  @Input()
  listOfUnit: HtmlSelectDto[];
  specimen;
  unit;

  constructor(private injector: Injector, private _tplService: Assay_TplServiceProxy, private _specService: Assay_SpecimenServiceProxy, private _unitService: Assay_UnitServiceProxy, public msg: NzMessageService) {
    super(injector);
  }

  ngOnInit() {
  }

  save() {
    if (!this.specimen || !this.unit) {
      this.msg.warning("输入框不能为空!");
    } else {
      const input = new CreateTplSpecimenDto();
      input.tplId = this.template.id;
      input.tplName = this.template.tplName;
      input.specId = this.specimen;

      from(this.listOfSpecimen).pipe(
        filter(x => x.key === this.specimen),
        take(1)
      ).subscribe(res => {
        input.specName = res.value;
      });
      input.unitId = this.unit;

      from(this.listOfUnit).pipe(
        filter(x => x.key === this.unit),
        take(1)
      ).subscribe(res => {
        input.unitName = res.value;
      });

      this._tplService.addTplSpecimen(input).subscribe((res) => {
        this.notify.info(res);
      });
    }
  }

}
