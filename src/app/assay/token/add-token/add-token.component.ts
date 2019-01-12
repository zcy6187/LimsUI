import { Component, OnInit, Injector, Input } from '@angular/core';
import { EditTplToken, Assay_TokenServiceProxy, Assay_TplServiceProxy, CreateTplToken, OrgTreeNodeDto, EditTplDto } from '@shared/service-proxies/service-proxies';
import { ModalComponentBase } from '@shared/component-base';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-add-token',
  templateUrl: './add-token.component.html',
  styles: []
})
export class AddTokenComponent extends ModalComponentBase implements OnInit {
  item: CreateTplToken;
  @Input()
  listOfOrg: OrgTreeNodeDto[];
  searchTplName;
  orgCode;
  templateList: EditTplDto[];
  tokenTplList: EditTplDto[];

  constructor(private _tokenService: Assay_TokenServiceProxy,
    private _tplService: Assay_TplServiceProxy,
    private injector: Injector,
    private msg: NzMessageService) {
    super(injector);
    this.item = new CreateTplToken();
    this.tokenTplList = new Array<EditTplDto>();
  }

  ngOnInit() {
  }

  btnSearch() {
    if (!this.orgCode && !this.searchTplName) {
      this.msg.warning("必须输入查询信息");
    } else {
      this.refreshTpl();
    }
  }

  refreshTpl(): void {
    if (this.searchTplName) {
      this.searchTplName = this.searchTplName.trim();
    }

    this._tplService.getTpls(this.orgCode, this.searchTplName)
      .subscribe((res: any) => {
        this.templateList = res;
        if (this.templateList.length === 0) {
          this.msg.warning("该条件下没有化验模板");
        }
      });
  }

  addTpl(item: EditTplDto) {
    if (this.tokenTplList.indexOf(item) >= 0) {
      this.msg.warning("已添加该模板！");
    } else {
      this.tokenTplList.push(item);
      const tempArray = [];
      for (const data of this.tokenTplList) {
        tempArray.push(data);
      }
      this.tokenTplList = tempArray;
    }
  }

  deleteTpl(item: EditTplDto) {
    const tempList = new Array<EditTplDto>();
    for (const tokenItem of this.tokenTplList) {
      if (tokenItem.id !== item.id) {
        tempList.push(tokenItem);
      }
    }
    this.tokenTplList = tempList;
  }

  save() {
    if (!this.item.cmdToken) {
      this.msg.warning("请输入令牌!");
      return;
    }
    if (!this.item.orgCode) {
      this.msg.warning("请选择机构!");
      return;
    }
    if (this.tokenTplList.length < 1) {
      this.msg.warning("请选择化验模板!");
      return;
    }
    let tplIds = "";
    for (const data of this.tokenTplList) {
      tplIds += data.id + ",";
    }
    tplIds = tplIds.slice(0, tplIds.length - 1);
    this.item.tplIds = tplIds;

    this._tokenService.addTplToken(this.item)
      .subscribe((res) => {
        this.msg.info(res);
      });

  }
}
