import { Component, OnInit, Injector } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PagedRequestDto, PagedListingComponentBase } from '@shared/component-base';
import {
  Assay_AttendanceServiceProxy, AttendanceDto, OrgServiceProxy, Assay_DataSearchServiceProxy, HtmlSelectDto, OrgTreeNodeDto, PagedResultDtoOfAttendanceDto, TemplateSchemaInputDto, SpecInputDto, Assay_DataInputServiceProxy, CreateDataInputDto, HtmlDataOperRetDto, Assay_UserServiceProxy
} from '@shared/service-proxies/service-proxies';
import { NzMessageService, isTemplateRef } from 'ng-zorro-antd';
import { FormControl, FormGroup } from '@angular/forms';
import pinyin from 'pinyin';


@Component({
  selector: 'app-xy-sign-data-input',
  templateUrl: './xy-sign-data-input.component.html',
  styles: [],
  providers: [DatePipe]
})
export class XySignDataInputComponent extends PagedListingComponentBase<AttendanceDto> implements OnInit {
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
  schema: TemplateSchemaInputDto; // 前台绑定信息
  eleSchema: TemplateSchemaInputDto; // 存储是否绑定的信息
  allSchema: TemplateSchemaInputDto; // 存储全部信息
  isShowAllElement: boolean;

  isVisible;
  historyInfo;
  profileForm: FormGroup;
  selectedItem: AttendanceDto;
  listOfOper = new Array<HtmlSelectDto>();
  submitBtnStatus = false;
  selfCode: string;
  formText: string; // 表单按钮（全部显示；只显示输入元素）


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

  // 获取化验室人员
  refreshUser() {
    if (this.listOfOper.length < 1) {
      this._assayUserService.getHtmlSelectAssayUsers()
        .subscribe((res: HtmlSelectDto[]) => {
          this.listOfOper = res;
        });
    }
  }

  btnSearch() {
    // 如果selfCode不为空，则不做其它检查
    if (this.selfCode) {
      this.getDataFromService(false);
      return;
    }
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
    let templateId = 0;
    if (this.templateId) {
      templateId = Number(this.templateId);
    }
    let selSpecId = "0";
    if (this.specId) {
      selSpecId = this.specId;
    }
    this._service.getAttendancesInfo(request.skipCount, request.maxResultCount, this.orgCode, templateId, selSpecId, Number(this.flagValue), this.timeArray[0], this.timeArray[1], this.selfCode)
      .finally(() => {
        finishedCallback();
      }).subscribe((result: PagedResultDtoOfAttendanceDto) => {
        this.dataList = result.items;
        this.totalItems = result.totalCount;
      });
  }

  private getDataFromService(isInput: boolean) {
    let templateId = 0;
    if (this.templateId) {
      templateId = Number(this.templateId);
    }
    let selSpecId = "0";
    if (this.specId) {
      selSpecId = this.specId;
    }
    this._service.getAttendancesInfo(0, this.pageSize, this.orgCode, templateId, selSpecId, Number(this.flagValue), this.timeArray[0], this.timeArray[1], this.selfCode)
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
    const newSchemaId = searchTplId + "#" + searchSpecId;

    this.isShowAllElement = false;
    if (newSchemaId !== this.oldSechmaId) {
      this.searchSchemaBySignId(item.id);
    } else {
      this.updateFormValue();
    }
    this.oldSechmaId = newSchemaId;
    this.isVisible = true;
    this.submitBtnStatus = false;
  }

  // 按签到ID加载动态表单,按是否有数据绘制表单
  searchSchemaBySignId(signId: number) {
    this._dataInputService.getTemplateSchemaInputDtoBySignId(signId)
      .subscribe(res => {
        if (!res) {
          this.msg.warning("找不到化验模板");
        } else {
          this.refreshUser();
          this.allSchema = res;
          this.eleSchema = this.getEleSchema(res);
          // 获取表单数据
          this._searchService.getFormValueBySignId(this.selectedItem.id)
            .subscribe((res: HtmlDataOperRetDto) => {
              // 有数据，则按照数据绘制表单
              if (res.code !== 0) {
                this.schemaInputToFormGroupWithValue(this.allSchema, res);
              } else {
                this.schemaInputToFormGroup(this.allSchema); // 没有数据，则绘制一个空表单
              }
              this.schema = this.eleSchema;
            });
        }
      });
  }

  // 生成元素架构表
  getEleSchema(res: TemplateSchemaInputDto): TemplateSchemaInputDto {
    let eleArray = this.selectedItem.elementIds.split(",");
    let tmpEleSchema = res.clone();
    tmpEleSchema.specList[0].eleList.forEach((item) => {
      if (eleArray.indexOf(item.eleId.toString()) >= 0) {
        item.isVisible = true;
      } else {
        item.isVisible = false;
      }
    });
    return tmpEleSchema;
  }

  // 从服务器更新表单数据
  updateFormValue() {
    this.resetFormValue(); // 全部置空,再赋值数据，置空时，可以将非输入的数据不显示。  
    this._searchService.getFormValueBySignId(this.selectedItem.id)
      .subscribe((res: HtmlDataOperRetDto) => {
        // 更新数据
        if (res.code !== 0) {
          this.profileForm.patchValue(JSON.parse(res.message));
        } else {
        }
      });
  }

  // 重置数据
  resetFormValue(): boolean {
    try {
      if (this.schema.specList) {
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
      return true;
    }
    catch{
      return false;
    }

  }

  // 动态生成表单
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

  schemaInputToFormGroupWithValue(schemaInfo: TemplateSchemaInputDto, dataInfo: HtmlDataOperRetDto) {
    const specArray: Array<SpecInputDto> = schemaInfo.specList;
    const mainGroup: any = {};
    const dataObj = JSON.parse(dataInfo.message);
    for (const specItem of specArray) {
      const tempSpecGroup = {};
      const specObj = dataObj["spe" + specItem.specId];
      tempSpecGroup['signId'] = new FormControl('');
      tempSpecGroup['signId'].setValue(this.selectedItem.id);
      tempSpecGroup['typeSpecId'] = new FormControl('');
      tempSpecGroup['typeSpecId'].setValue(specObj['typeSpecId']);
      for (const ele of specItem.eleList) {
        const tempEleGroup: any = {};
        const eleObj = specObj["ele" + ele.eleId];
        tempEleGroup['eleValue'] = new FormControl('');
        tempEleGroup['operId'] = new FormControl('');
        tempEleGroup['typeEleId'] = new FormControl('');
        tempEleGroup['eleName'] = new FormControl('');

        tempEleGroup['eleName'].setValue(ele.eleName);

        if (eleObj) {
          tempEleGroup['eleValue'].setValue(eleObj['eleValue']);
          tempEleGroup['operId'].setValue(eleObj['operId']);
          tempEleGroup['typeEleId'].setValue(eleObj['typeEleId']);
        }
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
    dataInput.samplingDate = this.selectedItem.samplingdate;
    dataInput.samplingTime = this.selectedItem.samplingTime;
    dataInput.signDate = this.selectedItem.signDate;
    dataInput.tplId = this.selectedItem.tplId;
    dataInput.formValue = JSON.stringify(valObj);
    this._dataInputService.writeValueToTable(dataInput)
      .subscribe((res: HtmlDataOperRetDto) => {
        this.msg.info(res.message);
        // 添加成功，则关闭
        if (res.code > -1) {
          this.isVisible = false;
        }
        // 刷新数据
        this.getDataFromService(true);
        this.submitBtnStatus = false;
      });
    // this.writeFormValToHistory(valObj);

  }

  showElement(valObj) {
    // 如果显示全部元素,则只显示部分元素
    if (this.isShowAllElement) {
      this.schema = this.eleSchema;
    } else {
      this.schema = this.allSchema;
    }
    this.profileForm.setValue(valObj);
    this.isShowAllElement = !this.isShowAllElement;
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
