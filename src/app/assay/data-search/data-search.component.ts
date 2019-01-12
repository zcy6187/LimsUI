import { Component, OnInit, Injector } from '@angular/core';
import { Assay_DataSearchServiceProxy, OrgServiceProxy, OrgTreeNodeDto, HtmlSelectDto, TemplateInfoDto, DataSearchTableDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/component-base';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-data-search',
  templateUrl: './data-search.component.html',
  styles: []
})
export class DataSearchComponent extends AppComponentBase implements OnInit {
  orgTree: OrgTreeNodeDto[];
  orgCode: string;
  templateId: string;
  tbHead: TemplateInfoDto;
  listOfTemplate: HtmlSelectDto[];
  listOfSpec: HtmlSelectDto[];
  specId;
  timeArray;
  tbBody: Array<Array<string>>;


  constructor(private _searchService: Assay_DataSearchServiceProxy,
    private _orgService: OrgServiceProxy,
    private injector: Injector, private msg: NzMessageService) {
    super(injector);
  }

  ngOnInit() {
    this._orgService.getOrgTreeByRootCode('00010002')
      .subscribe((res: OrgTreeNodeDto[]) => {
        this.orgTree = res;
      });
  }

  btnSearch() {
    // if (this.templateId) {
    //   const tplId = Number(this.templateId);
    //   this._searchService.getTemplateInfoByTemplateIdAndSpecId(tplId, this.specId).subscribe(res => {
    //     if (!res) {
    //       this.msg.warning("找不到该模板");
    //     } else {
    //       this.tbHead = res;
    //     }
    //   });
    // } else {
    //   this.msg.warning('请先选择化验模板！');
    // }

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

}
