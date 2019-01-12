import { Component, OnInit, Input, Injector } from '@angular/core';
import { TplDto, EditVUserTplDto, OrgTreeNodeDto, Assay_TplServiceProxy, EditTplDto, CreateUserTplDto, Assay_UserTplServiceProxy } from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { ModalComponentBase } from '@shared/component-base';

@Component({
  selector: 'app-edit-user-tpl',
  templateUrl: './edit-user-tpl.component.html',
  styles: []
})
export class EditUserTplComponent extends ModalComponentBase implements OnInit {

  @Input()
  userTplList: TplDto[];
  @Input()
  editVUserTpl: EditVUserTplDto;
  @Input()
  listOfOrg: OrgTreeNodeDto[];
  searchTplName;
  orgCode;
  templateList;

  constructor(private msg: NzMessageService, private _tplService: Assay_TplServiceProxy, private _userTplService: Assay_UserTplServiceProxy, private injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    if (!this.userTplList) {
      this.userTplList = new Array<TplDto>();
    }
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
    for (const data of this.userTplList) {
      if (data.id !== item.id) {
        tempTokenList.push(data);
      } else {
        isRepeat = true;
      }
    }
    if (isRepeat) {
      this.msg.warning("已添加该模板！");
    } else {
      const tempTokenTpl = new TplDto();
      tempTokenTpl.id = item.id;
      tempTokenTpl.tplName = item.tplName;
      tempTokenList.push(tempTokenTpl);
      this.userTplList = tempTokenList;
    }
  }

  deleteTpl(item: TplDto) {
    const tempList = new Array<TplDto>();
    for (const tokenItem of this.userTplList) {
      if (tokenItem.id !== item.id) {
        tempList.push(tokenItem);
      }
    }
    this.userTplList = tempList;
  }

  save() {
    if (this.userTplList.length < 1) {
      this.msg.warning("请选择化验模板!");
      return;
    }
    let tplIds = "";
    for (const data of this.userTplList) {
      tplIds += data.id + ",";
    }
    tplIds = tplIds.substr(0, tplIds.length - 1);
    if (this.editVUserTpl.userTplId) {
      this.editVUserTpl.tplIds = tplIds;
      this._userTplService.editUserTpl(this.editVUserTpl)
        .subscribe(() => {
          this.msg.info("修改成功！");
        },
          () => {
            this.msg.warning("网络连接异常！");
          });
    } else {
      const addItem = new CreateUserTplDto();
      addItem.lx = this.editVUserTpl.lx;
      addItem.tplIds = tplIds;
      addItem.userId = this.editVUserTpl.id;
      this._userTplService.addUserTpl(addItem)
        .subscribe(() => {
          this.msg.info("修改成功！");
        },
          () => {
            this.msg.warning("网络连接异常！");
          });
    }
    this.msg.info("修改成功!");

  }

}
