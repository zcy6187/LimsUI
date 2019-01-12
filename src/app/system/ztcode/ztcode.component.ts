import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/component-base';
import { ZtCodeServiceProxy, EditZtCodeDto, CreateZtCodeDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-ztcode',
  templateUrl: './ztcode.component.html',
  styles: []
})
export class ZtcodeComponent extends AppComponentBase implements OnInit {
  isVisible = false;
  dataList;
  formObj: EditZtCodeDto;

  constructor(private _appService: ZtCodeServiceProxy, private injector: Injector) {
    super(injector);
    this.formObj = new EditZtCodeDto();
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this._appService.getAllZtCode().subscribe(res => {
      this.dataList = res;
    });
  }

  create() {
    this.formObj = new EditZtCodeDto();
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  handleOk() {
    this.isVisible = false;
  }

  edit(item: EditZtCodeDto) {
    this.formObj = item;
    this.isVisible = true;
  }

  delete(item: EditZtCodeDto) {
    this._appService.deleteSingleZtCode(item.id).subscribe(
      res => {
        this.message.success(res.message);
      }
    );
    this.refresh();
  }

  submitForm() {
    if (!this.formObj.name || !this.formObj.code) {
      this.message.warn('名称和编码均不能为空！');
      return;
    }
    if (this.formObj.id > 0) {
      this._appService.editSingleZtCode(this.formObj).subscribe(
        res => {
          this.message.info(res.message);
        }
      )
    } else {
      this._appService.addSingleZtCode(this.formObj).subscribe(res => {
        this.message.info(res.message!);
      });
    }
    this.refresh();
  }

}
