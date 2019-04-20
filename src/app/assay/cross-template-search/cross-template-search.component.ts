import { Component, OnInit, Injector, ViewChild, TemplateRef } from '@angular/core';
import { Assay_DataSearchServiceProxy, OrgServiceProxy, OrgTreeNodeDto, HtmlSelectDto, TemplateInfoDto, DataSearchTableDto, Assay_SelfTplServiceProxy, SelfTplDto, KeyValDto, CreateTplDto, CreateSelfTplDto, HtmlDataOperRetDto, SelfSearchTableDto }
  from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/component-base';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-cross-template-search',
  templateUrl: './cross-template-search.component.html',
  styles: [],
  providers: [JsonPipe]
})
export class CrossTemplateSearchComponent extends AppComponentBase implements OnInit {
  orgTree: OrgTreeNodeDto[];
  orgCode: string;
  templateId: string;
  tbHead: Array<TemplateInfoDto>;
  listOfTemplate: HtmlSelectDto[];
  listOfSpec: HtmlSelectDto[];
  specId: any[];
  timeArray: Date[];
  tbBody: Array<Array<string>>;
  widthConfig: string[];
  scrollStyle;
  tplModal: NzModalRef;
  chgModal: NzModalRef;
  editModal: NzModalRef;
  chartData: any[];
  element;
  chgTpl: Array<SelfTplDto>;
  tplName;
  listOfSelfTpl: HtmlSelectDto[];
  selfTplId;
  selfTplArray: Array<CreateSelfTplDto>;
  colIndex = 0;
  elementArray: Array<string>;

  @ViewChild('tplTitle')
  tplTitle: TemplateRef<any>;  //获取模板
  @ViewChild('tplContent')
  tplContent: TemplateRef<any>;  //获取模板
  @ViewChild('tplFooter')
  tplFooter: TemplateRef<any>;  //获取模板

  @ViewChild('chgTitle')
  chgTitle: TemplateRef<any>;  //获取模板
  @ViewChild('chgContent')
  chgContent: TemplateRef<any>;  //获取模板
  @ViewChild('chgFooter')
  chgFooter: TemplateRef<any>;  //获取模板

  @ViewChild('editTitle')
  editTitle: TemplateRef<any>;  //获取模板
  @ViewChild('editContent')
  editContent: TemplateRef<any>;  //获取模板
  @ViewChild('editFooter')
  editFooter: TemplateRef<any>;  //获取模板

  constructor(private _searchService: Assay_DataSearchServiceProxy,
    private _orgService: OrgServiceProxy,
    private injector: Injector,
    private msg: NzMessageService,
    private modalService: NzModalService,
    private _selfTplService: Assay_SelfTplServiceProxy,
    private jsonPipe: JsonPipe) {
    super(injector);
    this.chgTpl = new Array<SelfTplDto>();
  }

  ngOnInit() {
    this._orgService.getOrgTreeByZtCode()
      .subscribe((res: OrgTreeNodeDto[]) => {
        this.orgTree = res;
        console.log(res);
      });
    this.timeArray = new Array<Date>();
    this.timeArray.push(new Date());
    this.timeArray.push(new Date());
    this.GetSelfTpls();
    // this.initTplList();
  }

  GetSelfTpls() {
    this._selfTplService.getTplInfoById()
      .subscribe((res: Array<CreateSelfTplDto>) => {
        if (res.length < 1) {
          this.msg.warning("当前还没有模板，请自己添加！");
        } else {
          this.selfTplArray = res;
          this.initTplList();
        }
      });
  }

  initTplList() {
    let treeDto = new Array<HtmlSelectDto>();
    if (this.selfTplArray) {
      this.selfTplArray.forEach((tplVal, index) => {
        var tmp = new HtmlSelectDto();
        var data = { 'key': tplVal.id, 'value': tplVal.tplName };
        tmp.init(data);
        treeDto.push(tmp);
      });
      this.listOfSelfTpl = treeDto;
    }
  }

  btnSearch() {
    if (this.selfTplId) {
      const selfTplId = Number(this.selfTplId);
      if (!this.timeArray || this.timeArray.length < 2) {
        this.msg.info('请选择查询时间段！');
        return;
      }
      this._searchService.getDataInfoBySelfCode(selfTplId, this.timeArray[0], this.timeArray[1])
        .subscribe((res: SelfSearchTableDto) => {
          if (!res) {
            this.msg.warning("找不到该模板");
          } else {
            this.tbHead = res.tableHead;
            this.tbBody = res.tableData;
            let widthArray = new Array<string>();
            widthArray.push("140px");

            let eleArray = new Array<string>();
            for (let i = 0; i < this.tbHead.length; i++) {
              for (let j = 0; j < this.tbHead[i].elements.length; j++) {
                widthArray.push("120px");
                eleArray.push(this.tbHead[i].elements[j].name);
              }
            };
            this.elementArray = eleArray;
            this.widthConfig = widthArray;
            let width = (120 * this.widthConfig.length + 140) + "px";  //设置总宽度
            this.scrollStyle = { x: width, y: "800px" };
          }
        });
    } else {
      this.msg.warning('请先选择化验模板！');
    }
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
    if (item) {
      this._searchService.getSpecimenHtmlSelectByTemplateId(item, false)
        .subscribe((res: HtmlSelectDto[]) => {
          if (res.length > 0) {
            let ff: HtmlSelectDto = new HtmlSelectDto();
            // ff.key = "-1";
            // ff.value = "全部";
            // res.unshift(ff);
            this.listOfSpec = res;
            let specArray = new Array<any>();
            specArray.push(res[0].key);
            this.specId = specArray;
          } else {
            this.msg.warning("该化验模板下没有样品信息！");
          }
        });
    }
  }

  sort(sort: { key: string, value: string }): void {
    let tempData = Array<Array<string>>();
    Object.assign(tempData, this.tbBody);
    let rowNum = tempData.length;
    let staticRow: Array<string> = tempData[rowNum - 1];
    tempData.splice(rowNum - 1);
    tempData = this.sortStringArray(tempData, 0, sort.value);
    tempData.push(staticRow);
    this.tbBody = tempData;
  }

  sortStringArray(tbData: Array<Array<string>>, compareIndex: number, sortType: string): Array<Array<string>> {
    let lenOfData = tbData.length;
    for (let i = 0; i < lenOfData; i++) {
      let temp = tbData[i][compareIndex];
      for (let j = i; j < lenOfData; j++) {
        let tempCompare = tbData[j][compareIndex];
        if (temp > tempCompare && sortType == "ascend") {
          let swap1 = tbData[i];
          let swap2 = tbData[j];
          tbData[i] = swap2;
          tbData[j] = swap1;
        }
        if (temp < tempCompare && sortType == "descend") {
          let swap1 = tbData[i];
          let swap2 = tbData[j];
          tbData[i] = swap2;
          tbData[j] = swap1;
        }
      }
    }
    return tbData;
  }

  getChartData(xindex) {
    let dataLen = this.tbBody.length;
    let totalNum = 0;
    let indexCount = 0;
    let avgNum: number = 0;
    let xArray = new Array<string>();
    let yArray = new Array<number>();
    // 最后一行是平均值
    for (let i = 0; i < dataLen - 1; i += 1) {
      let tmpArray = this.tbBody[i];
      let tmpValue = tmpArray[xindex + 1];
      let tmpNum = Number(tmpValue);

      if (tmpValue && !isNaN(tmpNum) && tmpNum > 0) {
        totalNum += tmpNum;
        xArray.push(tmpArray[0].substring(0, 16));
        yArray.push(tmpNum);
        indexCount++;
      }
    }
    avgNum = Number((totalNum / indexCount).toFixed(2));
    let tmpChartData: any[] = new Array<any>();
    for (let i = 0; i < xArray.length; i++) {
      tmpChartData.push({
        x: xArray[i],
        y: yArray[i]
      });
    }
    return tmpChartData;
  }

  showChart(xindex, xele) {
    console.log(xindex);
    this.element = xele;
    this.chartData = this.getChartData(xindex);
    this.tplModal = this.modalService.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 1200,
    });
  }

  destroyTplModal(): void {
    this.tplModal.destroy();
  }

  btnAdd(): void {
    this.chgModal = this.modalService.create({
      nzTitle: this.chgTitle,
      nzContent: this.chgContent,
      nzFooter: this.chgFooter,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 1200,
    });
  }
  closeChgModal(): void {
    this.chgModal.destroy();
  }
  // 将样品添加到数据
  addTplToTb(): void {
    let tplId = this.templateId;
    let specIds = this.specId;
    let isHave = false;
    // 检测该模板是否已经存在
    this.chgTpl.forEach((tplVal, index) => {
      if (tplVal.tplId == tplId) {
        isHave = true;
        tplVal.specList.forEach((specVal, specIndex) => {
          if (specIds.indexOf(specVal) < 0) {
            let tempKv: KeyValDto = new KeyValDto();
            let data = { 'key': specVal, 'val': this.getSpecNameById(specVal) }
            tempKv.init(data);
            tplVal.specList.push(tempKv);
          }
        });
      }
    });

    // 不存在，则全部添加
    if (!isHave) {
      let tmpTplDto = new SelfTplDto();
      tmpTplDto.tplId = tplId;
      tmpTplDto.tplName = this.getTplNameById(tplId);
      let tmpSpecList = new Array<KeyValDto>();
      specIds.forEach((specId, index) => {
        let tmpKvDto = new KeyValDto();
        let data = { 'key': specId, 'val': this.getSpecNameById(specId) }
        tmpKvDto.init(data);
        tmpSpecList.push(tmpKvDto);
      });
      tmpTplDto.specList = tmpSpecList;
      this.chgTpl.push(tmpTplDto);
    }
    console.log(this.jsonPipe.transform(this.chgTpl));
  }

  getSpecNameById(id): string {
    for (let item of this.listOfSpec) {
      if (item.key == id) {
        return item.value;
      }
    }
    return null;
  }

  getTplNameById(id): string {
    for (let item of this.listOfTemplate) {
      if (item.key == id) {
        return item.value;
      }
    }
    return null;
  }

  submitTpl() {
    if (!this.tplName) {
      this.msg.info("请输入模板名称！");
      return;
    }
    if (this.chgTpl.length < 2) {
      this.msg.info("至少选择两个模板！");
      return;
    }
    let temp = new CreateSelfTplDto();
    temp.tplName = this.tplName;
    temp.selfTpls = this.chgTpl;
    this._selfTplService.writeTplValueToTable(temp).subscribe((res: HtmlDataOperRetDto) => {
      if (res.code > 0) {
        this.msg.info(res.message);
        this.GetSelfTpls();
      } else {
        this.msg.warning("操作失败！");
      }
    });
  }
  clearTpl() {
    this.chgTpl = new Array<SelfTplDto>();
  }

  btnEdit(): void {
    this.editModal = this.modalService.create({
      nzTitle: this.editTitle,
      nzContent: this.editContent,
      nzFooter: this.editFooter,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 1200,
    });
  }
  closeEditModal(): void {
    this.editModal.destroy();
  }
  deleteSelfTpl(xid) {
    this._selfTplService.deleteSelfTplById(xid).subscribe((res) => {
      if (res.code > 0) {
        this.msg.info(res.message);
        this.GetSelfTpls();
      } else {
        this.msg.warning("操作失败！");
      }
    });
  }
}
