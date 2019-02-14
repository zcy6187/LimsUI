import { Component, OnInit, Injector } from '@angular/core';
import { HtmlSelectDto, Assay_DataSearchServiceProxy, MultiTableDataInfoDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/component-base';
import { NzMessageService } from 'ng-zorro-antd';

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

  constructor(private _searchService: Assay_DataSearchServiceProxy,
    private injector: Injector, private msg: NzMessageService) {
    super(injector);
  }

  ngOnInit() {
    this._searchService.getUserTemplatesByUserId()
      .subscribe(res => {
        if (res.length < 1) {
          this.msg.info("你没有任何权限！");
        } else {
          this.listOfTemplate = res;
        }

      });

    this.timeArray = [];
    this.timeArray.push(new Date());
    this.timeArray.push(new Date());
  }

  tplChange(item) {
    if (item) {
      this._searchService.getSpecimenHtmlSelectByTemplateIdAndChargeSpecimen(item, false)
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
      .subscribe((res: Array<MultiTableDataInfoDto>) => {
        this.searchData = res;
        let tempSizeArray = new Array<object>();
        let strArray = new Array<string>();
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
        });
        this.tbSizeArray = tempSizeArray;
        this.tbFooter = strArray;
      });
  }

}
