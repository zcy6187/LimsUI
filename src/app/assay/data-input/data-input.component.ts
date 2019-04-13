import { Component, OnInit, Injector } from '@angular/core';
import {
  OrgServiceProxy, Assay_DataSearchServiceProxy, HtmlSelectDto, TemplateInfoDto, OrgTreeNodeDto, Assay_DataInputServiceProxy,
  TemplateSchemaInputDto, SpecInputDto, ElementInputDto, CreateDataInputDto, Assay_UserServiceProxy, HtmlDataOperRetDto,
} from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/component-base';
import { FormGroup, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-data-input',
  templateUrl: './data-input.component.html',
  styles: []
})
export class DataInputComponent extends AppComponentBase implements OnInit {
  orgTree: OrgTreeNodeDto[];
  orgCode: string;
  templateId: string;
  tbHead: TemplateInfoDto;
  listOfTemplate: HtmlSelectDto[];
  listOfSpec: HtmlSelectDto[];
  schema: TemplateSchemaInputDto;
  profileForm: FormGroup;
  formWidth;
  specId;
  isVisible = false;
  samplingDate: Date;
  samplingTime: string;
  listOfTime: Array<HtmlSelectDto>;
  historyInfo = new Array<any>();
  initInfo = new Array<any>();
  formInfo;
  listOfOper = new Array<HtmlSelectDto>();
  tableSize: {};

  constructor(private _searchService: Assay_DataSearchServiceProxy,
    private _orgService: OrgServiceProxy,
    private injector: Injector, private msg: NzMessageService,
    private _dataInputService: Assay_DataInputServiceProxy,
    private _assayUserService: Assay_UserServiceProxy,
    private datePipe: DatePipe) {
    super(injector);
    this.createSamplingTime();
    this.historyInfo = new Array<Array<string>>();
  }

  ngOnInit() {
    this._orgService.getOrgTreeByZtCode()
      .subscribe((res: OrgTreeNodeDto[]) => {
        this.orgTree = res;
      });

    this._assayUserService.getHtmlSelectAssayUsers()
      .subscribe((res: HtmlSelectDto[]) => {
        this.listOfOper = res;
      });
    this.samplingDate = new Date();
  }

  // 采样时间
  createSamplingTime() {
    let tempListTime = new Array<HtmlSelectDto>();
    for (let i = 0; i < 24; i++) {
      const temp1 = new HtmlSelectDto();
      let tempStr = "0" + i;
      if (i > 9) {
        tempStr = i.toString();
      }
      temp1.key = tempStr + "00";
      temp1.value = tempStr + ":00";
      tempListTime.push(temp1);
      const temp2 = new HtmlSelectDto();
      temp2.key = +tempStr + "30";
      temp2.value = tempStr + ":30";
      tempListTime.push(temp2);
    }
    this.listOfTime = tempListTime;
  }

  btnSearch() {
    if (this.templateId) {
      let specArray = [];
      this._dataInputService.getTemplateSchemaInputDtoByTplId(Number(this.templateId), this.specId)
        .subscribe(res => {
          if (!res) {
            this.msg.warning("找不到化验模板");
          } else {
            this.schema = res;
            this.schemaInputToFormGroup(res);
            this.historyInfo = [];
          }
        });
    } else {
      this.msg.warning('请先选择化验模板！');
    }
  }

  schemaInputToFormGroup(schemaInfo: TemplateSchemaInputDto) {
    const specArray: Array<SpecInputDto> = schemaInfo.specList;
    const mainGroup: any = {};
    let eleCount = 0;
    for (const specItem of specArray) {
      const tempSpecGroup = {};
      tempSpecGroup['signId'] = new FormControl('');
      tempSpecGroup['typeSpecId'] = new FormControl('');
      for (const ele of specItem.eleList) {
        const tempEleGroup: any = {};
        tempEleGroup['eleValue'] = new FormControl('');
        tempEleGroup['operId'] = new FormControl('');
        tempEleGroup['typeEleId'] = new FormControl('');
        tempEleGroup['eleName'] = new FormControl('');
        tempEleGroup['eleName'].setValue(ele.eleName);
        tempSpecGroup[ele.formName] = new FormGroup(tempEleGroup);
        eleCount = eleCount + 1;
      }
      mainGroup[specItem.formName] = new FormGroup(tempSpecGroup);
    }
    this.profileForm = new FormGroup(mainGroup);
    this.formInfo = schemaInfo;
    this.tableSize = {
      x: (eleCount * 80 + 240).toString() + "px",
      y: '650px'
    };
  }

  orgChange(item) {
    if (item) {
      this._searchService.getTemplateHtmlSelectDtosByOrgCode(item)
        .subscribe((res: HtmlSelectDto[]) => {
          if (res.length > 0) {
            this.listOfTemplate = res;
            this.templateId = this.listOfTemplate[0].key;
            this.tplChange(this.templateId);
          } else {
            this.msg.info("该机构下没有化验模板！");
          }
        });
    }
  }

  tplChange(item) {
    console.log(item);
    if (item) {
      this._searchService.getSpecimenHtmlSelectByTemplateId(item, true)
        .subscribe((res: HtmlSelectDto[]) => {
          if (res.length > 0) {
            this.listOfSpec = res;
          } else {
            this.msg.warning("该化验模板下没有样品信息！");
          }
        });
    }
  }

  _submitForm($event, valObj) {
    if (!this.samplingDate) {
      this.msg.warning("送样日期不能为空！");
      return;
    }
    if (!this.samplingTime) {
      this.msg.warning("送样时间不能为空！");
      return;
    }

    const dataInput = new CreateDataInputDto();
    dataInput.samplingDate = this.samplingDate.toLocaleDateString();
    let tmpTime: string = this.samplingTime.substring(0, 2) + ":" + this.samplingTime.substring(2);
    if (this.samplingTime.length < 4) {
      this.samplingTime = "0" + this.samplingTime;
      tmpTime = this.samplingTime.substring(0, 2) + ":" + this.samplingTime.substring(2);
    }
    dataInput.samplingTime = tmpTime;
    dataInput.tplId = Number(this.templateId);
    dataInput.signDate = null;
    dataInput.formValue = JSON.stringify(valObj);
    this._dataInputService.writeValueToTable(dataInput)
      .subscribe((res: HtmlDataOperRetDto) => {
        this.msg.info(res.message);
      });
    this.writeFormValToHistory(valObj);
  }

  writeFormValToHistory(valObj) {
    const tempArray = new Array<string>();
    const inputDate = this.samplingDate.toLocaleDateString();
    const inputTime = this.samplingTime.toString();
    tempArray.push(inputDate);
    tempArray.push(inputTime);
    for (const key of Object.keys(valObj)) {
      if (valObj.hasOwnProperty(key)) {
        const tempObj = valObj[key];
        let index = 0;
        for (const tempKey of Object.keys(tempObj)) {
          if (tempObj.hasOwnProperty(tempKey)) {
            if (index >= 2) {
              const eleObj = tempObj[tempKey];
              tempArray.push(eleObj['eleValue']);
            }
            index++;
          }
        }
      }
    }
    this.historyInfo.push(tempArray);
    this.initInfo.push(valObj);
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
