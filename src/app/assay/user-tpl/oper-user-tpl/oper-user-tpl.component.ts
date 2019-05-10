import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/component-base';
import { OrgServiceProxy, OrgTreeNodeDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-oper-user-tpl',
  templateUrl: './oper-user-tpl.component.html',
  styles: []
})
export class OperUserTplComponent extends AppComponentBase implements OnInit {

  orgNodes: Array<OrgTreeNodeDto>;

  constructor(private _orgService: OrgServiceProxy, private injector: Injector) {
    super(injector);
  }

  ngOnInit() {
  }

  loadAllOrg() {
    this._orgService.getOrgTree()
      .finally(() => console.log('OK'))
      .subscribe((res: OrgTreeNodeDto[]) => {
        this.orgNodes = res;
      });
  }

  loadSelectedOrg() {

  }

}
