import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/component-base';
import { OrgServiceProxy, OrgTreeNodeDto, Assay_UserTplServiceProxy, Assay_TplServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-oper-user-tpl',
  templateUrl: './oper-user-tpl.component.html',
  styles: []
})
export class OperUserTplComponent extends AppComponentBase implements OnInit {

  orgNodes: Array<OrgTreeNodeDto>;
  orgCheckedKeys: Array<string>;
  tplCheckedKeys: Array<string>;
  tplTableData;
  tplSpecCheckedKeys: Array<string>;
  tplSpecTableData;

  constructor(private _orgService: OrgServiceProxy,
    private injector: Injector,
    private _uTplService: Assay_UserTplServiceProxy,
    private _tplService: Assay_TplServiceProxy) {
    super(injector);
  }

  ngOnInit() {
  }

  loadAllOrg() {
    this._orgService.getOrgTree()
      .subscribe((res: OrgTreeNodeDto[]) => {
        this.orgNodes = res;
      });
  }

  getSelectedOrg() {
    this._uTplService.getUserOrgIds().subscribe(res => {
      this.orgCheckedKeys = res;
    });
  }

  loadTplIdByOrgId(orgId: number) {
    this._tplService.getTplsByOrgId(orgId).subscribe(res => {
      this.tplTableData = res;
    })
  }

  getSelectedTplIds(orgId: number) {
    this._uTplService.getUserTplIdsByOrgId(orgId).subscribe(res => {
      this.tplCheckedKeys = res;
    });
  }

  loadSpecIdsByTplId(tplId: number) {
    this._tplService.getTplSpecimensByTplId(orgId).subscribe(res => {
      this.tplSpecTableData = res;
    })
  }

  getSelectedTplSpecIds(tplId: number) {
    this._uTplService.getUserTplSpecIds(tplId).subscribe(res => {
      this.tplSpecTableData = res;
    });
  }

}
