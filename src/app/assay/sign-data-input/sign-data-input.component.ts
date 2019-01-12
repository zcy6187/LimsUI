import { Component, OnInit, Injector } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PagedRequestDto, PagedListingComponentBase } from '@shared/component-base';
import {
  Assay_AttendanceServiceProxy, AttendanceDto, OrgServiceProxy, Assay_DataSearchServiceProxy, HtmlSelectDto, OrgTreeNodeDto, PagedResultDtoOfAttendanceDto, TemplateSchemaInputDto, SpecInputDto, Assay_DataInputServiceProxy, CreateDataInputDto, HtmlDataOperRetDto, Assay_UserServiceProxy
} from '@shared/service-proxies/service-proxies';
import { NzMessageService, isTemplateRef } from 'ng-zorro-antd';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sign-data-input',
  templateUrl: './sign-data-input.component.html',
  styles: [],
  providers: [DatePipe]
})
export class SignDataInputComponent extends PagedListingComponentBase<AttendanceDto> implements OnInit {
  flagValue: string;
  timeArray: any;
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

  constructor(private _service: Assay_AttendanceServiceProxy, private _injector: Injector,
    private _searchService: Assay_DataSearchServiceProxy,
    private _orgService: OrgServiceProxy,
    private injector: Injector, private msg: NzMessageService, private _dataInputService: Assay_DataInputServiceProxy,
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
    this.getDataFromService();
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

  private getDataFromService() {
    this._service.getAttendances(0, this.pageSize, this.orgCode, Number(this.templateId), this.specId, Number(this.flagValue), this.timeArray[0], this.timeArray[1])
      .subscribe((result: PagedResultDtoOfAttendanceDto) => {
        this.dataList = result.items;
        this.totalItems = result.totalCount;
        if (this.dataList.length < 1) {
          this.message.info('该条件下没有找到合适的信息！');
        }
      });
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
      this._searchService.getSpecimenHtmlSelectByTemplateId(item)
        .subscribe((res: HtmlSelectDto[]) => {
          if (res.length > 0) {
            this.listOfSpec = res;
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
    // 绘制表单
    if (newSchemaId !== this.oldSechmaId) {
      const specArray = new Array<number>();
      specArray.push(searchSpecId);
      this.searchSchema(searchTplId, specArray);
    }
    // 填充数据
    this.searchFormValue();
    this.oldSechmaId = newSchemaId;
    this.isVisible = true;
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
          }
        });
    } else {
      this.msg.warning('请先选择化验模板！');
    }
  }

  searchFormValue() {
    this._searchService.getFormValueBySignId(this.selectedItem.id)
      .subscribe((res: HtmlDataOperRetDto) => {
        console.log(res.code);
        if (res.code !== 0) {
          console.log(res.message);
          this.profileForm.patchValue(JSON.parse(res.message));
        } else {
          this.resetFormValue();
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
    console.log(JSON.stringify(formObj));
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
    const dataInput = new CreateDataInputDto();
    dataInput.samplingDate = this.selectedItem.signDate;
    dataInput.samplingTime = '';
    dataInput.signDate = this.selectedItem.signDate;
    dataInput.tplId = this.selectedItem.tplId;
    dataInput.formValue = JSON.stringify(valObj);
    this._dataInputService.writeValueToTable(dataInput)
      .subscribe((res: HtmlDataOperRetDto) => {
        this.msg.info(res.message);
        // 刷新数据
        this.getDataFromService();
      });
    // this.writeFormValToHistory(valObj);
  }

}
