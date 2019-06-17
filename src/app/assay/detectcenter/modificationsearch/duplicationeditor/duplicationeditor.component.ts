import { Component, OnInit, Injector, Input } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';
import { DetectServiceProxy, ModifyEditInfoDto, HtmlSelectDto, Assay_UserServiceProxy, HtmlDataOperRetDto } from '@shared/service-proxies/service-proxies';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-duplicationeditor',
  templateUrl: './duplicationeditor.component.html',
  styles: []
})
export class DuplicationeditorComponent extends ModalComponentBase implements OnInit {
  @Input()
  dupId: number;
  listOfOper: Array<HtmlSelectDto>;
  formModel: Array<formObj>;
  profileForm: FormGroup;
  tableSpan: number;
  editSpan: number;
  isShowEdit: boolean;
  isShowTable: boolean;
  tbData: Array<ModifyEditInfoDto>
  curEleId: number;
  curEleName: string;
  operId: string;
  isSaveValid: boolean;

  constructor(
    private injector: Injector,
    private _detectService: DetectServiceProxy,
    private _assayUserService: Assay_UserServiceProxy,
    private _fb: FormBuilder) {
    super(injector);
  }

  ngOnInit() {
    this.tableSpan = 24;
    this.editSpan = 0;
    this.isShowEdit = false;
    this.isShowTable = true;
    this.initData();
    this.getOperList();
  }

  initData() {
    this._detectService.getSingleModifyInfo(this.dupId).subscribe(res => {
      this.tbData = res;
      this.isShowTable = true;
    });
  }

  getOperList() {
    this._assayUserService.getHtmlSelectAssayUsersByOrgCode("00010005")
      .subscribe((res: HtmlSelectDto[]) => {
        this.listOfOper = res;
      });
  }

  showEditor(eleId: number) {
    this.curEleId = eleId;
    this.getEleNameByEleId();
    this.getDuplicationInfo();
  }

  showFormAndCloseTable() {
    this.tableSpan = 0;
    this.editSpan = 24;
    this.isShowEdit = true;
    this.isShowTable = false;
    this.isSaveValid = true;
  }

  getEleNameByEleId() {
    this.tbData.some((val) => {
      if (val.eleId == this.curEleId) {
        this.curEleName = val.eleName;
        return true;
      }
    })
  }

  getDuplicationInfo() {
    this._detectService.getDuplicationEleInfoByEleId(this.dupId, this.curEleId).subscribe(res => {
      let tmpForm = new Array<formObj>();
      let mainFormProfile = {};

      if (res.length > 0) {
        let resIndex = 1;
        res.forEach((detectItem, index) => {
          let formInfo = new formObj();

          let formStr = "ele" + resIndex.toString();
          formInfo.formId = formStr;
          formInfo.ctlName = this.curEleName + resIndex.toString();
          formInfo.ctlValue = detectItem.eleValue;
          formInfo.operId = detectItem.operId.toString();
          tmpForm.push(formInfo);

          let tmpFormProfile = {};
          tmpFormProfile["dupId"] = new FormControl(detectItem.dupId.toString());
          tmpFormProfile["eleValue"] = new FormControl(formInfo.ctlValue);
          tmpFormProfile["operValue"] = new FormControl(formInfo.operId);
          mainFormProfile[formStr] = this._fb.group(tmpFormProfile);
          resIndex++;
        });
      } else {
        let emptyForm = new formObj();
        emptyForm.formId = "ele1";
        emptyForm.ctlName = this.curEleName + "0";
        emptyForm.ctlValue = "";
        emptyForm.operId = "0";
        tmpForm.push(emptyForm);

        let tmpFormProfile = {};
        tmpFormProfile["dupId"] = new FormControl('0');
        tmpFormProfile["eleValue"] = new FormControl('');
        tmpFormProfile["operValue"] = new FormControl('0');
        mainFormProfile["ele1"] = this._fb.group(tmpFormProfile);
      }
      this.formModel = tmpForm;
      this.profileForm = this._fb.group(mainFormProfile);
      this.showFormAndCloseTable();
    });
  }

  addElement() {
    let tmpForm = new Array<formObj>();
    let mainFormProfile = {};
    let maxIndex = 1;
    this.formModel.forEach((item, index) => {
      tmpForm.push(item);

      let tmpFormProfile = {};
      tmpFormProfile["dupId"] = new FormControl(item.dupId);
      tmpFormProfile["eleValue"] = new FormControl(item.ctlValue);
      tmpFormProfile["operValue"] = new FormControl(item.operId);
      mainFormProfile[item.formId] = this._fb.group(tmpFormProfile);

      maxIndex++;
    });


    let emptyForm = new formObj();
    let formStr = "ele" + maxIndex.toString();
    emptyForm.formId = formStr;
    emptyForm.dupId = "0"
    emptyForm.ctlName = this.curEleName + maxIndex.toString();
    emptyForm.ctlValue = "";
    emptyForm.operId = "0";
    tmpForm.push(emptyForm);

    let tmpFormProfile = {};
    tmpFormProfile["dupId"] = new FormControl('0');
    tmpFormProfile["eleValue"] = new FormControl('');
    tmpFormProfile["operValue"] = new FormControl('0');
    mainFormProfile[formStr] = this._fb.group(tmpFormProfile);

    this.formModel = tmpForm;
    let tmpProfileForm = this._fb.group(mainFormProfile);
    let oldFormValue = this.profileForm.value; // 将原来的值复制到新的profileForm中。
    tmpProfileForm.patchValue(oldFormValue);
    this.profileForm = tmpProfileForm;
  }

  closeEditor() {
    this.tableSpan = 24;
    this.editSpan = 0;
    this.isShowEdit = false;
    this.isShowTable = true;
  }

  saveElements() {
    this.isSaveValid = false;
    let formStr = JSON.stringify(this.profileForm.value);
    this._detectService.addOrUpdateDuplicationParallelInfo(this.dupId, this.curEleId, formStr).subscribe((res: HtmlDataOperRetDto) => {
      if (res.code > 0) {
        this.message.info(res.message);
        this.closeEditor();
        this.initData();
      } else {
        this.message.warn(res.message);
        this.isSaveValid = true;
      }
    });
  }

  saveDuplicate(eleId: number) {
    let eleValue: string;
    this.tbData.some((item, index) => {
      if (item.eleId == eleId) {
        eleValue = item.eleValue;
        return true;
      }
    });
    if (eleValue) {
      this._detectService.addOrUpdateDuplicationModifyInfo(this.dupId, eleId, eleValue).subscribe((res: HtmlDataOperRetDto) => {
        if (res.code > 0) {
          this.message.info(res.message);
        } else {
          this.message.warn(res.message);
        }
      });
    } else {
      this.message.warn("数据不能为空！");
    }
  }

}

class formObj {
  public formId: string;
  public dupId: string;
  public ctlValue: string;
  public operId: string;
  public ctlName: string;
}
