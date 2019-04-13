import { Component, OnInit, Injector, Input } from '@angular/core';
import { EditTplToken, Assay_TokenServiceProxy, Assay_TplServiceProxy, CreateTplToken, OrgTreeNodeDto, EditTplDto, TokenTplDto } from '@shared/service-proxies/service-proxies';
import { ModalComponentBase } from '@shared/component-base';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-edit-token',
  templateUrl: './edit-token.component.html',
  styles: []
})
export class EditTokenComponent extends ModalComponentBase implements OnInit {
  @Input()
  item: EditTplToken;
  @Input()
  listOfOrg: OrgTreeNodeDto[];
  @Input()
  tokenTplList: TokenTplDto[];
  searchTplName;
  orgCode;
  templateList: EditTplDto[];


  constructor(private _tokenService: Assay_TokenServiceProxy,
    private _tplService: Assay_TplServiceProxy,
    private injector: Injector,
    private msg: NzMessageService) {
    super(injector);
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
    const tempTokenList = [];
    let isRepeat = false;
    for (const data of this.tokenTplList) {
      if (data.id !== item.id) {
        tempTokenList.push(data);
      } else {
        isRepeat = true;
      }
    }
    if (isRepeat) {
      this.msg.warning("已添加该模板！");
    } else {
      const tempTokenTpl = new TokenTplDto();
      tempTokenTpl.id = item.id;
      tempTokenTpl.tplName = item.tplName;
      tempTokenList.push(tempTokenTpl);
      this.tokenTplList = tempTokenList;
    }
  }

  deleteTpl(item: TokenTplDto) {
    const tempList = new Array<TokenTplDto>();
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
    // if (this.tokenTplList.length < 1) {
    //   this.msg.warning("请选择化验模板!");
    //   return;
    // }
    let tplIds = "";
    console.log(this.tokenTplList);
    if (this.tokenTplList.length > 0) {
      for (const data of this.tokenTplList) {
        tplIds += data.id + ",";
      }
    }
    tplIds = tplIds.substr(0, tplIds.length - 1);
    this.item.tplIds = tplIds;

    this._tokenService.editTplToken(this.item)
      .subscribe((res) => {
        this.msg.info(res);
      });

  }
}
