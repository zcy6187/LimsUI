import { Component, OnInit, Injector, Input } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';

@Component({
  selector: 'app-duplicationeditor',
  templateUrl: './duplicationeditor.component.html',
  styles: []
})
export class DuplicationeditorComponent extends ModalComponentBase {
  @Input()
  dupId: number;
  formModel: Array<formObj>;
  tableSpan: number;
  editSpan: number;
  isShowEdit: boolean;


  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.tableSpan = 24;
    this.editSpan = 0;
  }

  showEditor() {
    this.tableSpan = 6;
    this.editSpan = 18;
    this.isShowEdit = true;
    let tmpForm = new Array<formObj>();
    for (let i = 0; i < 3; i++) {
      let formInfo = new formObj();
      formInfo.eleId = i.toString();
      formInfo.eleValue = "0.234";
      formInfo.ctlName = "ctl" + i.toString();
      formInfo.operId = i.toString();
      tmpForm.push(formInfo);
    }
    this.formModel = tmpForm;
  }

  addElement() {
    let tmpForm = new Array<formObj>();
    this.formModel.forEach(item => {
      tmpForm.push(item);
    });
    let formInfo = new formObj();
    formInfo.eleId = "4";
    formInfo.eleValue = "0.234";
    formInfo.ctlName = "ctl4";
    formInfo.operId = "4";
    tmpForm.push(formInfo);
    this.formModel = tmpForm;
  }

  closeEditor() {
    this.tableSpan = 24;
    this.editSpan = 0;
    this.isShowEdit = true;
  }

  showInfo() {
    let str = "";
    this.formModel.forEach((item) => {
      str += item.eleValue;
    });
    console.log(str);
  }

}

class formObj {
  public eleId: string;
  public eleValue: string;
  public operId: string;
  public ctlName: string;
}
