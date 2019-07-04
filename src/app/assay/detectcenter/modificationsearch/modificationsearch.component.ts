import { Component, OnInit, Injector } from '@angular/core';
import { OrgTreeNodeDto, OrgServiceProxy, HtmlSelectDto, DetectServiceProxy, Assay_DataSearchServiceProxy, TableInfoDto, ModifyTableInfoDto, ModifyRowInfoDto, HtmlDataOperRetDto } from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/component-base';
import { DuplicationeditorComponent } from './duplicationeditor/duplicationeditor.component';

@Component({
  selector: 'app-modificationsearch',
  templateUrl: './modificationsearch.component.html',
  styles: []
})
export class ModificationsearchComponent extends AppComponentBase implements OnInit {
  searchId: string;
  timeArray: Date[];
  orgTree: Array<OrgTreeNodeDto>;
  listOfTemplate: HtmlSelectDto[];
  listOfSpec: HtmlSelectDto[];
  templateId: string;
  specId: string;
  dateType: string = "import";
  tableData: Array<ModifyRowInfoDto>;
  tableTitle: Array<string>;
  titleLength;
  mapOfExpandData: { [key: string]: boolean } = {};
  rowCount;
  orgCode: string;

  constructor(private _orgService: OrgServiceProxy,
    private _searchService: Assay_DataSearchServiceProxy,
    private injector: Injector,
    private msg: NzMessageService,
    private _detectService: DetectServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    // 时间初始化
    this.timeArray = new Array<Date>();
    this.timeArray.push(new Date());
    this.timeArray.push(new Date());
    // 组织初始化
    this._orgService.getOrgTreeByZtCode()
      .subscribe((res: OrgTreeNodeDto[]) => {
        this.orgTree = res;
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
    if (item) {
      this._searchService.getSpecimenHtmlSelectByTemplateId(item, false)
        .subscribe((res: HtmlSelectDto[]) => {
          if (res.length > 0) {
            this.listOfSpec = res;
            this.specId = res[0].key;
          } else {
            this.msg.warning("该化验模板下没有样品信息！");
          }
        });
    }
  }

  btnSearch() {
    let dateSearchType = 1;
    if (this.dateType == "print") {
      dateSearchType = 0;
    }
    if (!this.specId) {
      this.message.warn("请先选择样品！");
      return;
    }
    this._detectService.searchDuplicateModificationItems(Number(this.specId), this.timeArray[0], this.timeArray[1], this.searchId, dateSearchType)
      .subscribe((res: ModifyTableInfoDto) => {
        this.tableData = res.rowList;
        this.tableTitle = res.titleList;
        this.titleLength = res.titleList.length;
        this.rowCount = res.rowList.length;
      });
  }

  editor(dupId: number) {
    this.modalHelper
      .open(DuplicationeditorComponent, { 'dupId': dupId }, 'lg', {
        nzMask: true,
      }).subscribe(() => { console.log("ok") });
  }

  updateModify() {
    let dateSearchType = 1;
    if (this.dateType == "print") {
      dateSearchType = 0;
    }
    if (!this.specId) {
      this.message.warn("请先选择样品！");
      return;
    }

    this._detectService.patchUpdateModificationItems(Number(this.specId), this.timeArray[0], this.timeArray[1], this.searchId, dateSearchType)
      .subscribe((res: HtmlDataOperRetDto) => {
        if (res.code > 0) {
          this.message.info(res.message);
        } else {
          this.message.warn(res.message);
        }
      });
  }

}
