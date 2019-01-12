import { Component, OnInit, Injector, Input, Output, EventEmitter } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';
import { Assay_TplServiceProxy, EditTplDto, HtmlSelectDto, Assay_SpecimenServiceProxy, Assay_UnitServiceProxy, EditTplSpecimenDto } from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { from } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-edit-tpl-specimen',
  templateUrl: './edit-tplSpecimen.component.html',
  styles: []
})
export class EditTplSpecimenComponent extends ModalComponentBase implements OnInit {

  @Input()
  item: EditTplSpecimenDto;
  @Input()
  specId;
  @Input()
  unitId;
  @Input()
  listOfSpecimen: HtmlSelectDto[];
  @Input()
  listOfUnit: HtmlSelectDto[];
  saving: false;


  constructor(private injector: Injector, private _tplService: Assay_TplServiceProxy, private _specService: Assay_SpecimenServiceProxy, private _unitService: Assay_UnitServiceProxy, public msg: NzMessageService) {
    super(injector);
  }

  ngOnInit() {
    console.log(this.specId);
    console.log(this.unitId);

  }

  save() {
    if (!this.specId || !this.unitId) {
      this.msg.warning("输入框不能为空!");
    } else {
      const input: EditTplSpecimenDto = this.item;
      input.specId = this.specId;

      from(this.listOfSpecimen).pipe(
        filter(x => x.key === this.specId),
        take(1)
      ).subscribe(res => {
        input.specName = res.value;
      });

      input.unitId = this.unitId;

      from(this.listOfUnit).pipe(
        filter(x => x.key === this.unitId),
        take(1)
      ).subscribe(res => {
        input.unitName = res.value;
      });

      this._tplService.editTplSpecimen(input).subscribe((res) => {
        this.notify.info(res);
      });
    }
  }

}
