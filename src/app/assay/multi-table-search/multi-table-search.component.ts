import { Component, OnInit, Injector, ViewChild, TemplateRef } from '@angular/core';
import { HtmlSelectDto, Assay_DataSearchServiceProxy, MultiTableDataInfoDto, OrgDto, OrgServiceProxy, OrgTreeNodeDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/component-base';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { AppConsts } from '@shared/AppConsts';

@Component({
  selector: 'app-multi-table-search',
  templateUrl: './multi-table-search.component.html',
  styles: []
})
export class MultiTableSearchComponent extends AppComponentBase implements OnInit {
  listOfTemplate;
  listOfSpec;
  searchData: Array<MultiTableDataInfoDto>;
  timeArray: Date[];
  templateId;
  specId: any[];
  tbSizeArray: Array<object>;
  tbFooter: Array<string>;
  avgFooter: Array<Array<string>>;
  rowFooter: Array<Array<string>>;
  orgTree: OrgTreeNodeDto[];
  orgCode: string;

  signTimeSort: string;
  samplingTimeSort: string;
  colVisible: Array<boolean>;
  isVisible: boolean = false;

  tplModal: NzModalRef;
  chartData: any[];
  element;

  @ViewChild('tplTitle')
  tplTitle: TemplateRef<any>;  //获取模板
  @ViewChild('tplContent')
  tplContent: TemplateRef<any>;  //获取模板
  @ViewChild('tplFooter')
  tplFooter: TemplateRef<any>;  //获取模板

  constructor(private _searchService: Assay_DataSearchServiceProxy,
    private injector: Injector,
    private msg: NzMessageService,
    private http: HttpClient,
    private _orgService: OrgServiceProxy,
    private modalService: NzModalService) {
    super(injector);
  }

  ngOnInit() {
    this._orgService.getOrgTreeByTplQx()
      .subscribe((res: OrgTreeNodeDto[]) => {
        this.orgTree = res;
      });

    this.rowFooter = new Array<Array<string>>();
    this.avgFooter = new Array<Array<string>>();

    this.timeArray = [];
    this.timeArray.push(new Date());
    this.timeArray.push(new Date());

    this.colVisible = [true, true, true, true, true, true];
  }

  orgChange(item) {
    if (item) {
      this._searchService.getTemplateHtmlSelectDtosByOrgCodeAndTplQx(item)
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
      this._searchService.getSpecimenHtmlSelectByTemplateIdAndChargeSpecimen(item, false)
        .subscribe((res: HtmlSelectDto[]) => {
          if (res.length > 0) {
            if (res.length > 1) {
              var tmp = new HtmlSelectDto();
              tmp.key = '-1', tmp.value = '全部';
              res.push(tmp);
              this.listOfSpec = res;
            }
            let selectArray = new Array<any>();
            selectArray.push(res[0].key);
            this.specId = selectArray;
          } else {
            this.msg.warning("该化验模板下没有样品信息！");
          }
        });
    }
  }

  btnSearch() {
    if (this.specId.length < 1) {
      this.msg.warning('请选择样品！');
      return;
    }
    this._searchService.getMultiTableDataInfoBySpecId(this.templateId, this.specId, this.timeArray[0], this.timeArray[1])
      .subscribe((res: Array<MultiTableDataInfoDto>) => {
        this.searchData = res;
        if (res.length < 1) {
          this.msg.warning("该条件下找不到数据！");
          return;
        }
        let tempSizeArray = new Array<object>();
        let strArray = new Array<string>();
        let rowInfo = new Array<Array<string>>();
        let avgInfo = new Array<Array<string>>();
        this.searchData.forEach(element => {
          let xsize = element.tableHead.length * 120 + 620 + 'px';
          tempSizeArray.push({ x: xsize, y: '400px' });
          let str = "";
          element.statisticData.forEach((st, i) => {
            if (i == 0) {
              str += "    " + st.eleName + ":" + st.totalRowNum + "行";
            } else {
              str += "    " + st.eleName + ":" + st.totalRowNum + "行/" + st.avgValue;
            }
          })
          strArray.push(str);
          let avgArray: Array<string> = new Array<string>();
          let rowArray: Array<string> = new Array<string>();

          element.statisticData.forEach((st, i) => {
            rowArray.push(st.totalRowNum.toString());
            avgArray.push(st.avgValue.toString());
          });
          avgInfo.push(avgArray);
          rowInfo.push(rowArray);
        });
        this.tbSizeArray = tempSizeArray;
        this.tbFooter = strArray;
        this.rowFooter = rowInfo;
        this.avgFooter = avgInfo;
      });
  }

  downloadExcelOneSheet() {
    if (this.specId.length < 1) {
      this.msg.warning('请选择样品！');
      return;
    }
    this._searchService.getExcelNameBySpecIdSinleSheet(this.templateId, this.specId, this.timeArray[0], this.timeArray[1])
      .subscribe(file => {
        console.log(file);
        if (file == "-1") {
          this.msg.warning("生成失败，请重新操作！")
        } else {
          this.openExcel(file);
        }

      });
  }

  downloadExcelMultiSheet() {
    if (this.specId.length < 1) {
      this.msg.warning('请选择样品！');
      return;
    }
    this._searchService.getExcelNameBySpecIdMultiSheet(this.templateId, this.specId, this.timeArray[0], this.timeArray[1])
      .subscribe(file => {
        console.log(file);
        if (file == "-1") {
          this.msg.warning("生成失败，请重新操作！")
        } else {
          this.openExcel(file);
        }

      });
  }

  openExcel(fileName: string) {
    let url = AppConsts.uploadApiUrl + "api/excel?fileName=" + fileName;
    this.http.get(url, {
      responseType: "blob",
      headers: { 'Accept': 'application/vnd.ms-excel' }
    }).subscribe(blob => {
      saveAs(blob, fileName);
    });
  }

  sort(sort: { key: string, value: string }): void {
    let sortIndex = 0;
    if (sort.key === 'samplingTime') {
      sortIndex = 1;
    }
    let tempData: MultiTableDataInfoDto[] = Array<MultiTableDataInfoDto>();
    Object.assign(tempData, this.searchData);
    for (let i = 0; i < tempData.length; i++) {
      let tbItem = tempData[i];
      let tempTbData = new Array<Array<string>>();
      tempTbData = this.sortStringArray(tbItem.tableData, sortIndex, sort.value);
      tbItem.tableData = tempTbData;
      tempData[i] = tbItem;
    }
    this.searchData = tempData;
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

  btnIsShow() {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  handleOk() {
    this.isVisible = false;
  }

  getChartData(tbNum, eleNum) {
    let tmpData = this.searchData[tbNum].tableData;
    let dataLen = tmpData.length;
    let totalNum = 0;
    let indexCount = 0;
    let avgNum: number = 0;
    let xArray = new Array<string>();
    let yArray = new Array<number>();

    for (let i = 0; i < dataLen; i += 1) {
      let tmpArray = tmpData[i];
      let tmpValue = tmpArray[eleNum + 6];
      let tmpNum = Number(tmpValue);

      if (tmpValue && !isNaN(tmpNum) && tmpNum > 0) {
        totalNum += tmpNum;
        xArray.push(tmpArray[1].substring(0, 16));
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

  showChart(tNum, eleNum) {
    this.element = this.searchData[tNum].tableHead[eleNum];
    this.chartData = this.getChartData(tNum, eleNum);
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

}
