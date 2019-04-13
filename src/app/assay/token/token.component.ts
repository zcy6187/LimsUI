import { Component, OnInit, Injector } from '@angular/core';
import { Assay_TokenServiceProxy, EditTplToken, CreateTplDto, OrgTreeNodeDto, OrgServiceProxy, HtmlSelectDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/component-base';
import { NzMessageService } from 'ng-zorro-antd';
import { AddTokenComponent } from './add-token/add-token.component';
import { EditTokenComponent } from './edit-token/edit-token.component';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styles: []
})
export class TokenComponent extends AppComponentBase implements OnInit {
  orgCode: string;
  tokenName: string;
  listOfToken: EditTplToken[];
  listOfOrg: OrgTreeNodeDto[];

  constructor(private _service: Assay_TokenServiceProxy, private injector: Injector, private msg: NzMessageService, private _orgService: OrgServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    this._orgService.getOrgTreeByZtCode()
      .subscribe(res => {
        this.listOfOrg = res;
      });
  }

  // 查询数据
  btnSearch() {
    this.refresh();
  }

  refresh() {
    if (!this.orgCode && !this.tokenName) {
      this.msg.warning("请输入查询信息！");
    } else {
      this._service.getTplTokensByConf(this.orgCode, this.tokenName)
        .subscribe(res => {
          this.listOfToken = res;
          if (!res) {
            this.msg.warning("该条件下找不到任何信息！");
          }
        });
    }
  }

  edit(item: EditTplToken) {
    this.modalHelper.open(EditTokenComponent, { item: item, listOfOrg: this.listOfOrg, tokenTplList: item.tokenTplList }, 'lg', {
      nzMask: true,
    })
      .subscribe((ret: any) => {
      });
  }

  create() {
    this.modalHelper.open(AddTokenComponent, { listOfOrg: this.listOfOrg }, 'lg', {
      nzMask: true,
    })
      .subscribe((ret: any) => {
      });
  }

  delete(item: EditTplToken) {
    this._service.deleteTplToken(item.id)
      .subscribe(() => {
        this.message.info("操作完成！");
        this.refresh();
      });
  }
}
