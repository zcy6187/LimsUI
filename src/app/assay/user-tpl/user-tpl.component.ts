import { Component, OnInit, Injector } from '@angular/core';
import { EditVUserTplDto, Assay_UserTplServiceProxy, OrgTreeNodeDto, OrgServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/component-base';
import { EditUserTplComponent } from './edit-user-tpl/edit-user-tpl.component';

@Component({
  selector: 'app-user-tpl',
  templateUrl: './user-tpl.component.html',
  styles: []
})
export class UserTplComponent extends AppComponentBase implements OnInit {
  name: string;
  listOfUserTpl: EditVUserTplDto[];
  listOfOrg: OrgTreeNodeDto[];

  constructor(private injector: Injector, private _service: Assay_UserTplServiceProxy, private _orgService: OrgServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    this._orgService.getOrgTreeByZtCode()
      .subscribe((res: OrgTreeNodeDto[]) => {
        this.listOfOrg = res;
      });
  }

  btnSearch() {
    this.refresh();
  }

  refresh() {
    this._service.searchUserTpls(this.name)
      .subscribe(res => {
        if (res.length === 0) {
          this.message.warn("找不到用户信息!");
        } else {
          this.listOfUserTpl = res;
        }
      });
  }

  edit(item: EditVUserTplDto) {
    this.modalHelper.open(EditUserTplComponent, { userTplList: item.tplList, listOfOrg: this.listOfOrg, editVUserTpl: item }, 'lg', {
      nzMask: true,
    })
      .subscribe(
        () => {
          this.refresh();
        }
      );
  }

}
