import { Component, OnInit, Input, Injector } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base/modal-component-base';
import { EditAssayUserDto, Assay_UserServiceProxy, HtmlSelectDto, ZtCodeServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-edit-oper',
  templateUrl: './edit-oper.component.html',
  styles: []
})
export class EditAssayUserComponent extends ModalComponentBase implements OnInit {

  saving: boolean = false;
  ztCode: string;
  listOfZtCode: HtmlSelectDto[];
  @Input()
  element: EditAssayUserDto;

  constructor(
    injector: Injector,
    private _assayService: Assay_UserServiceProxy,
    private _ztCodeService: ZtCodeServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
    this.getZtCodeList();
    this.ztCode = this.element.orgCode;
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
      this._assayService.update(this.element)
        .finally(() => {
          this.saving = false;
        })
        .subscribe((res: any) => {
          this.notify.info(res);
        });
    } else {
      this.notify.warn("数据不能为空！");
    }
  }

}
