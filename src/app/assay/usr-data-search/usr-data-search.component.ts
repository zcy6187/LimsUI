import { Component, OnInit, Injector, TemplateRef, ViewChild } from '@angular/core';
import { Assay_DataSearchServiceProxy, OrgServiceProxy, OrgTreeNodeDto, HtmlSelectDto, TemplateInfoDto, DataSearchTableDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/component-base';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from '@shared/AppConsts';

@Component({
  selector: 'app-usr-data-search',
  templateUrl: './usr-data-search.component.html',
  styles: []
})
export class UsrDataSearchComponent extends AppComponentBase implements OnInit {
  orgTree: OrgTreeNodeDto[];
  orgCode: string;
  templateId: string;
  tbHead: TemplateInfoDto;
  listOfTemplate: HtmlSelectDto[];
  listOfSpec: HtmlSelectDto[];
  specId: any[];
  timeArray: Date[];
  tbBody: Array<Array<string>>;
  widthConfig: string[];
  scrollStyle;

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
    private _orgService: OrgServiceProxy,
    private injector: Injector,
    private msg: NzMessageService,
    private modalService: NzModalService,
    private http: HttpClient) {
    super(injector);
  }

  ngOnInit() {
    this._orgService.getOrgTreeByTplQx()
      .subscribe((res: OrgTreeNodeDto[]) => {
        this.orgTree = res;
      });
    this.timeArray = new Array<Date>();
    this.timeArray.push(new Date());
    this.timeArray.push(new Date());
  }

  btnSearch() {
    if (this.templateId) {
      const tplId = Number(this.templateId);
      if (!this.timeArray || this.timeArray.length < 2) {
        this.msg.info('请选择查询时间段！');
        return;
      }
      this._searchService.getDataInfoByTemplateIdAndSpecId(tplId, this.specId, this.timeArray[0], this.timeArray[1])
        .subscribe((res: DataSearchTableDto) => {
          if (!res) {
            this.msg.warning("找不到该模板");
          } else {
            this.tbHead = res.tableHead;
            this.tbBody = res.tableData;
            let widthArray = new Array<string>();
            widthArray.push("180px");
            // widthArray.push("100px");
            for (let i = 0; i < this.tbHead.elements.length; i++) {
              widthArray.push("120px")
            };
            this.widthConfig = widthArray;
            let width = (120 * this.widthConfig.length + 180) + "px";  //设置总宽度
            this.scrollStyle = { x: width, y: "600px" };
          }
        });
    } else {
      this.msg.warning('请先选择化验模板！');
    }
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
              let ff: HtmlSelectDto = new HtmlSelectDto();
              ff.key = "-1";
              ff.value = "全部";
              res.unshift(ff);
            }
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

  btnDownload() {
    if (this.templateId) {
      const tplId = Number(this.templateId);
      if (!this.timeArray || this.timeArray.length < 2) {
        this.msg.info('请选择查询时间段！');
        return;
      }
      this._searchService.getExcelNameByTemplateIdAndSpecId(tplId, this.specId, this.timeArray[0], this.timeArray[1])
        .subscribe(file => {
          if (file == "-1") {
            this.msg.warning("生成失败，请重新操作！")
          } else {
            this.openExcel(file);
          }
        });
    } else {
      this.msg.warning('请先选择化验模板！');
    }
  }

  openExcel(fileName: string) {
    let url = AppConsts.excelBaseUrl + "api/excel?fileName=" + fileName;
    this.http.get(url, {
      responseType: "blob",
      headers: { 'Accept': 'application/vnd.ms-excel' }
    }).subscribe(blob => {
      saveAs(blob, fileName);
    });
  }

}
