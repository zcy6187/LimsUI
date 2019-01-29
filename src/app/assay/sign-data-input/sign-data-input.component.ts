import { Component, OnInit, Injector } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PagedRequestDto, PagedListingComponentBase } from '@shared/component-base';
import {
  Assay_AttendanceServiceProxy, AttendanceDto, OrgServiceProxy, Assay_DataSearchServiceProxy, HtmlSelectDto, OrgTreeNodeDto, PagedResultDtoOfAttendanceDto, TemplateSchemaInputDto, SpecInputDto, Assay_DataInputServiceProxy, CreateDataInputDto, HtmlDataOperRetDto, Assay_UserServiceProxy
} from '@shared/service-proxies/service-proxies';
import { NzMessageService, isTemplateRef } from 'ng-zorro-antd';
import { FormControl, FormGroup } from '@angular/forms';
import pinyin from 'pinyin';
import { rS } from '@angular/core/src/render3';

@Component({
  selector: 'app-sign-data-input',
  templateUrl: './sign-data-input.component.html',
  styles: [],
  providers: [DatePipe]
})
export class SignDataInputComponent extends PagedListingComponentBase<AttendanceDto> implements OnInit {
  flagValue: string;
  timeArray: Date[];
  orgTree: OrgTreeNodeDto[];
  orgCode: string;
  templateId: string;
  listOfTemplate: HtmlSelectDto[];
  listOfSpec: HtmlSelectDto[];
  specId;
  dataList;
  isTableLoading;
  oldSechmaId;
  schema;
  isVisible;
  historyInfo;
  profileForm: FormGroup;
  selectedItem: AttendanceDto;
  listOfOper = new Array<HtmlSelectDto>();
  submitBtnStatus = false;

  constructor(private _service: Assay_AttendanceServiceProxy, private _injector: Injector,
    private _searchService: Assay_DataSearchServiceProxy,
    private _orgService: OrgServiceProxy, private msg: NzMessageService, private _dataInputService: Assay_DataInputServiceProxy,
    private _assayUserService: Assay_UserServiceProxy,
    private datePipe: DatePipe) {
    super(_injector);
  }

  ngOnInit() {
    this.flagValue = '0';
    this._orgService.getOrgTreeByZtCode()
      .subscribe((res: OrgTreeNodeDto[]) => {
        this.orgTree = res;
      });
    this.isTableLoading = false;
    this.isVisible = false;
    let selectTime = [];
    selectTime.push(new Date());
    selectTime.push(new Date());
    this.timeArray = selectTime;
  }

  refreshUser() {
    if (this.listOfOper.length < 1) {
      this._assayUserService.getHtmlSelectAssayUsers()
        .subscribe((res: HtmlSelectDto[]) => {
          this.listOfOper = res;
        });
    }
  }

  btnSearch() {
    if (!this.orgCode) {
      this.message.info('机构不能为空！');
      return;
    }
    if (!(this.timeArray && this.timeArray.length === 2)) {
      this.message.info('开始时间和结束时间不能为空！');
      return;
    }
    this.isTableLoading = true;
    this.getDataFromService(false);
    this.isTableLoading = false;
  }

  // 分页加载数据
  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._service.getAttendances(request.skipCount, request.maxResultCount, this.orgCode, Number(this.templateId), this.specId, Number(this.flagValue), this.timeArray[0], this.timeArray[1])
      .finally(() => {
        finishedCallback();
      }).subscribe((result: PagedResultDtoOfAttendanceDto) => {
        this.dataList = result.items;
        this.totalItems = result.totalCount;
      });
  }

  private getDataFromService(isInput: boolean) {
    this._service.getAttendances(0, this.pageSize, this.orgCode, Number(this.templateId), this.specId, Number(this.flagValue), this.timeArray[0], this.timeArray[1])
      .subscribe((result: PagedResultDtoOfAttendanceDto) => {
        this.dataList = result.items;
        this.totalItems = result.totalCount;
        if (this.dataList.length < 1) {
          if (!isInput) {
            this.message.info('该条件下没有数据！');
          } else {
            this.message.info('该条件下没有可录入的数据！');
          }

        }
      });
  }

  // 加载模板
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

  // 加载样品
  tplChange(item) {
    if (item) {
      this._searchService.getSpecimenHtmlSelectByTemplateId(item, true)
        .subscribe((res: HtmlSelectDto[]) => {
          if (res.length > 0) {
            this.listOfSpec = res;
            this.specId = this.listOfSpec[0].key;
          } else {
            this.msg.warning("该化验模板下没有样品信息！");
          }
        });
    }
  }

  // 编辑数据
  edit(item: AttendanceDto) {
    this.selectedItem = item;
    const searchTplId = item.tplId;
    const searchSpecId = item.tplSpecId;
    const newSchemaId = searchSpecId + "#" + searchSpecId;

    if (newSchemaId !== this.oldSechmaId) {
      // 绘制表单并填充数据
      const specArray = new Array<number>();
      specArray.push(searchSpecId);
      this.searchSchema(searchTplId, specArray);
    } else {
      // 仅填充数据
      this.searchFormValue();
    }
    this.oldSechmaId = newSchemaId;
    this.isVisible = true;
    this.submitBtnStatus = false;
  }

  // 加载动态表单
  searchSchema(tplId: number, specArray: Array<number>) {
    if (this.templateId) {
      this._dataInputService.getTemplateSchemaInputDtoByTplId(tplId, specArray)
        .subscribe(res => {
          if (!res) {
            this.msg.warning("找不到化验模板");
          } else {
            this.refreshUser();
            this.schema = res;
            this.schemaInputToFormGroup(res);
            this.historyInfo = [];
            this.searchFormValue();
          }
        });
    } else {
      this.msg.warning('请先选择化验模板！');
    }
  }

  // 从服务器更新表单数据
  searchFormValue() {
    this._searchService.getFormValueBySignId(this.selectedItem.id)
      .subscribe((res: HtmlDataOperRetDto) => {
        // 更新数据
        if (res.code !== 0) {
          this.profileForm.patchValue(JSON.parse(res.message));
        } else {
          this.resetFormValue(); // 全部置空
        }
      });
  }

  resetFormValue() {
    const specArray: Array<SpecInputDto> = this.schema.specList;
    const mainGroup: any = {};
    const formObj = {};
    for (const specItem of specArray) {
      const specObj = {};
      specObj['signId'] = this.selectedItem.id;
      specObj['typeSpecId'] = '';
      for (const ele of specItem.eleList) {
        const eleObj = {};
        eleObj['eleValue'] = '';
        eleObj['operId'] = '';
        eleObj['typeEleId'] = '';
        eleObj['eleName'] = ele.eleName;
        specObj['ele' + ele.eleId] = eleObj;
      }
      formObj['spe' + specItem.specId] = specObj;
    }
    this.profileForm.setValue(formObj);
  }

  // 生成表单
  schemaInputToFormGroup(schemaInfo: TemplateSchemaInputDto) {
    const specArray: Array<SpecInputDto> = schemaInfo.specList;
    const mainGroup: any = {};
    for (const specItem of specArray) {
      const tempSpecGroup = {};
      tempSpecGroup['signId'] = new FormControl('');
      tempSpecGroup['signId'].setValue(this.selectedItem.id);
      tempSpecGroup['typeSpecId'] = new FormControl('');
      for (const ele of specItem.eleList) {
        const tempEleGroup: any = {};
        tempEleGroup['eleValue'] = new FormControl('');
        tempEleGroup['operId'] = new FormControl('');
        tempEleGroup['typeEleId'] = new FormControl('');
        tempEleGroup['eleName'] = new FormControl('');
        tempEleGroup['eleName'].setValue(ele.eleName);
        tempSpecGroup[ele.formName] = new FormGroup(tempEleGroup);
      }
      mainGroup[specItem.formName] = new FormGroup(tempSpecGroup);
    }
    this.profileForm = new FormGroup(mainGroup);
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  // 数据存入数据库
  _submitForm($event, valObj) {
    this.submitBtnStatus = true;
    const dataInput = new CreateDataInputDto();
    dataInput.samplingDate = this.selectedItem.signDate;
    dataInput.samplingTime = '';
    dataInput.signDate = this.selectedItem.signDate;
    dataInput.tplId = this.selectedItem.tplId;
    dataInput.formValue = JSON.stringify(valObj);
    this._dataInputService.writeValueToTable(dataInput)
      .subscribe((res: HtmlDataOperRetDto) => {
        this.msg.info(res.message);
        if (res.code > -1) {
          this.isVisible = false;
        }
        // 刷新数据
        this.getDataFromService(true);
        this.submitBtnStatus = false;
      });
    // this.writeFormValToHistory(valObj);

  }

  pinyinFilterOption = (value, opt) => {
    if (opt.nzLabel.indexOf(value) !== -1) {
      return true;
    }
    const shouzimu = pinyin(opt.nzLabel, { style: pinyin.STYLE_FIRST_LETTER }) as string[];
    let compareStr = shouzimu.join('');
    return (compareStr.indexOf(value) !== -1);
  }

}
