import { Component, OnInit, Injector } from '@angular/core';
import { CreateAssayUserDto, Assay_UserServiceProxy, EditAssayUserDto, ZtCodeServiceProxy, HtmlSelectDto } from '@shared/service-proxies/service-proxies';
import { ModalComponentBase } from '@shared/component-base';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-create-oper',
  templateUrl: './create-oper.component.html',
  styles: []
})
export class CreateAssayUserComponent extends ModalComponentBase {

  element: CreateAssayUserDto = new CreateAssayUserDto();
  saving: boolean = false;
  ztCode: string;
  listOfZtCode: HtmlSelectDto[];

  constructor(
    injector: Injector,
    private _assayBaseService: Assay_UserServiceProxy,
    private _ztCodeService: ZtCodeServiceProxy,
    private msg: NzMessageService
  ) {
    super(injector);
    this.getZtCodeList();
  }

  getZtCodeList() {
    let ztCodeList = new Array<HtmlSelectDto>();
    this._ztCodeService.getAllZtCode().subscribe((res) => {
      res.forEach((valItem) => {
        const selectItem = new HtmlSelectDto();
        selectItem.key = valItem.code;
        selectItem.value = valItem.name;
        ztCodeList.push(selectItem);
      });
      this.listOfZtCode = ztCodeList;
    })
  }

  save(): void {
    this.saving = true;
    let ztName;
    if (this.ztCode) {
      this.listOfZtCode.forEach((valItem: HtmlSelectDto) => {
        if (valItem.key == this.ztCode) {
          ztName = valItem.value;
        }
      });
      this.element.orgCode = this.ztCode;
      this.element.orgName = ztName;
      this._assayBaseService.add(this.element)
        .finally(() => { this.saving = false; })
        .subscribe((res: any) => {
          this.notify.info(res);
        });
    } else {
      this.notify.warn("数据不能为空！");
    }
  }

}
