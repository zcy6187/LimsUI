import { Component, OnInit, Injector } from '@angular/core';
import { OrgTreeNodeDto, OrgServiceProxy, Assay_StatisticServiceProxy } from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/component-base';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-statistic-exceler',
  templateUrl: './statistic-exceler.component.html',
  styles: [
    `
    .loading {
    text-align: center;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    margin-bottom: 20px;
    padding: 30px 50px;
    margin: 20px 0;
    width:100%;
    height:700px;
  }`]
})
export class StatisticExcelerComponent extends AppComponentBase implements OnInit {

  orgTree: OrgTreeNodeDto[];
  orgCode: string;
  timeArray: Date[];
  isLoading: boolean;


  constructor(
    private _orgService: OrgServiceProxy,
    private injector: Injector, private msg: NzMessageService, private _statisticService: Assay_StatisticServiceProxy, private http: HttpClient) {
    super(injector);
  }

  ngOnInit() {
    this._orgService.getOrgTreeByZtCode()
      .subscribe((res: OrgTreeNodeDto[]) => {
        this.orgTree = res;
      });
    let ttimeArray = [];
    ttimeArray.push(new Date());
    ttimeArray.push(new Date());
    this.timeArray = ttimeArray;
    this.isLoading = true;
  }

  btnSearch() {
    this.downloadExcelMultiSheet();
  }

  downloadExcelMultiSheet() {
    if (!this.orgCode) {
      this.msg.warning("请先选择组织！");
      return;
    }
    this.isLoading = false;
    this._statisticService.getExcel(this.timeArray[0], this.timeArray[1], this.orgCode)
      .subscribe(file => {
        console.log(file);
        this.isLoading = true;
        if (file == "-1") {
          this.msg.warning("生成失败，请重新操作！")
        } else {
          this.openExcel(file);
        }
      });
  }

  openExcel(fileName: string) {
    let url = "http://131.107.2.64:2155/api/excel?fileName=" + fileName;
    this.http.get(url, {
      responseType: "blob",
      headers: { 'Accept': 'application/vnd.ms-excel' }
    }).subscribe(blob => {
      saveAs(blob, fileName);
    });

  }
}