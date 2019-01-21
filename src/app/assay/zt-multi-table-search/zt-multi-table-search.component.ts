import { Component, OnInit, Injector } from '@angular/core';
import { HtmlSelectDto, Assay_DataSearchServiceProxy, MultiTableDataInfoDto, OrgServiceProxy, OrgTreeNodeDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/component-base';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-zt-multi-table-search',
  templateUrl: './zt-multi-table-search.component.html',
  styles: []
})
export class ZtMultiTableSearchComponent extends AppComponentBase implements OnInit {
  listOfTemplate;
  listOfSpec;
  searchData: Array<MultiTableDataInfoDto>;
  timeArray: Date[];
  templateId;
  specId: any[];
  orgTree;
  orgCode;

  constructor(private _searchService: Assay_DataSearchServiceProxy, private _orgService: OrgServiceProxy,
    private injector: Injector, private msg: NzMessageService) {
    super(injector);
  }

  ngOnInit() {
    this._orgService.getOrgTreeByZtCode()
      .subscribe((res: OrgTreeNodeDto[]) => {
        this.orgTree = res;
      });

    this.timeArray = [];
    this.timeArray.push(new Date());
    this.timeArray.push(new Date());
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
      .subscribe(res => {
        this.searchData = res;
        console.log(res);
      });
  }

}

