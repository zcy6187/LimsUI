import { Component, OnInit, Injector, ViewChild, TemplateRef } from '@angular/core';
import { AppComponentBase } from '@shared/component-base';
import { OrgServiceProxy, OrgTreeNodeDto, HtmlSelectDto, DetectServiceProxy, Assay_DataSearchServiceProxy } from '@shared/service-proxies/service-proxies';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-exceloper',
  templateUrl: './exceloper.component.html',
  styles: []
})
export class ExceloperComponent extends AppComponentBase implements OnInit {
  fileType: string;
  orgTree: OrgTreeNodeDto[];
  orgCode: string;
  templateId: string;
  specId: number;
  timeArray: Date[];
  listOfTemplate: HtmlSelectDto[];
  listOfSpec: HtmlSelectDto[];
  tbBody: Array<Array<string>>;

  constructor(private _searchService: Assay_DataSearchServiceProxy,
    private _orgService: OrgServiceProxy,
    private _detectService: DetectServiceProxy,
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
    this.fileType = "xls/xlsx";
  }

  btnSearch() {
    // if (this.templateId) {
    //   const tplId = Number(this.templateId);
    //   if (!this.timeArray || this.timeArray.length < 2) {
    //     this.msg.info('请选择查询时间段！');
    //     return;
    //   }
    //   this._searchService.getDataInfoByTemplateIdAndSpecId(tplId, this.specId, this.timeArray[0], this.timeArray[1])
    //     .subscribe((res: DataSearchTableDto) => {
    //       if (!res) {
    //         this.msg.warning("找不到该模板");
    //       } else {
    //         this.tbHead = res.tableHead;
    //         this.tbBody = res.tableData;
    //         let widthArray = new Array<string>();
    //         widthArray.push("180px");
    //         // widthArray.push("100px");
    //         for (let i = 0; i < this.tbHead.elements.length; i++) {
    //           widthArray.push("120px")
    //         };
    //         this.widthConfig = widthArray;
    //         let width = (120 * this.widthConfig.length + 180) + "px";  //设置总宽度
    //         this.scrollStyle = { x: width, y: "600px" };
    //       }
    //     });
    // } else {
    //   this.msg.warning('请先选择化验模板！');
    // }
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
            // let ff: HtmlSelectDto = new HtmlSelectDto();
            // ff.key = "-1";
            // ff.value = "全部";
            // res.unshift(ff);
            this.listOfSpec = res;
            this.specId = Number.parseInt(res.keys[0]);
          } else {
            this.msg.warning("该化验模板下没有样品信息！");
          }
        });
    }
  }

  btnDownload() {
    if (this.specId > 0) {
      this._detectService.downLoadExcelBySpecId(this.specId).subscribe(res => {
        this.msg.info(res);
      });
    } else {
      this.msg.warning("请选择样品");
    }
  }

  openExcel(fileName: string) {
    let url = "http://local:2155/api/excel?fileName=" + fileName;
    this.http.get(url, {
      responseType: "blob",
      headers: { 'Accept': 'application/vnd.ms-excel' }
    }).subscribe(blob => {
      saveAs(blob, fileName);
    });
  }

}
