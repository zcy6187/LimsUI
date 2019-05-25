import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/component-base';
import { OrgServiceProxy, OrgTreeNodeDto, Assay_UserTplServiceProxy, Assay_TplServiceProxy, HtmlDataOperRetDto, UserLoginInfoDto, EditVUserTplDto } from '@shared/service-proxies/service-proxies';
import { TbData } from '../tb-data';
import { NzTreeComponent, NzTreeNode } from 'ng-zorro-antd';

@Component({
  selector: 'app-oper-user-tpl',
  templateUrl: './oper-user-tpl.component.html',
  styles: []
})
export class OperUserTplComponent extends AppComponentBase implements OnInit {

  orgNodes: Array<OrgTreeNodeDto>;
  orgCheckedKeys: Array<string>;
  tplCheckedKeys: Array<string>;
  tplTableData: Array<TbData>;
  isTplAllChecked: boolean;
  tplSpecCheckedKeys: Array<string>;
  tplSpecTableData: Array<TbData>;
  isSpecAllChecked: boolean;
  selectOrgName: string;
  selectTplName: string;
  selectOrgCode;
  selectTplId;

  @Input()
  userItem: EditVUserTplDto;

  @ViewChild('orgTree') orgTree: NzTreeComponent;

  constructor(private _orgService: OrgServiceProxy,
    private injector: Injector,
    private _uTplService: Assay_UserTplServiceProxy,
    private _tplService: Assay_TplServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    this.loadAllOrg();
    this.orgCheckedKeys = new Array<string>();
  }

  loadAllOrg() {
    this._orgService.getOrgTree()
      .subscribe((res: OrgTreeNodeDto[]) => {
        this.orgNodes = res;
        this.getSelectedOrg();
      });
  }

  getSelectedOrg() {
    this._uTplService.getUserOrgIdsByUserId(this.userItem.id).subscribe(res => {
      this.orgCheckedKeys = res;
    });
  }

  loadTplIdByOrgId(orgCode: string) {
    this._tplService.getTplsByOrgCodeStrick(orgCode).subscribe(res => {
      let tmpArray = new Array<TbData>();
      if (res.length > 0) {
        res.forEach((item, index) => {
          let tmpRow = new TbData();
          tmpRow.id = item.id;
          tmpRow.name = item.tplName;
          tmpRow.isChecked = true;
          tmpArray.push(tmpRow);
        });
        this.getSelectedTplIds(orgCode, tmpArray);
      } else {
        this.tplTableData = tmpArray;
      }
    })
  }

  getSelectedTplIds(orgCode: string, tmpArray: Array<TbData>) {
    this._uTplService.getUserTplIdsByOrgCodeAndUserId(orgCode, this.userItem.id).subscribe(res => {
      this.isTplAllChecked = true;
      if (res.length > 0) {
        tmpArray.forEach((item, index) => {
          if (res.indexOf(item.id.toString()) < 0) {
            item.isChecked = false;
            this.isTplAllChecked = false;
          }
        });
      }
      this.tplTableData = tmpArray;
      console.log(tmpArray);
    });
  }

  loadSpecIdsByTplId(tplId: number) {
    this._tplService.getTplSpecimensByTplId(tplId).subscribe(res => {
      let tmpArray = new Array<TbData>();
      if (res.length > 0) {
        res.forEach((item, index) => {
          let tmpRow = new TbData();
          tmpRow.id = item.id;
          tmpRow.name = item.specName;
          tmpRow.isChecked = true;
          tmpArray.push(tmpRow);
        });
        this.getSelectedTplSpecIds(tplId, tmpArray);
      } else {
        this.tplSpecTableData = tmpArray;
      }
    })
  }

  getSelectedTplSpecIds(tplId: number, tmpArray: Array<TbData>) {
    this._uTplService.getUserTplSpecIdsByUserId(tplId, this.userItem.id).subscribe(res => {
      this.isSpecAllChecked = true;
      if (res.length > 0) {
        tmpArray.forEach((item, index) => {
          if (res.indexOf(item.id.toString()) < 0) {
            item.isChecked = false;
            this.isTplAllChecked = false;
          }
        });
      }
      this.tplSpecTableData = tmpArray;
    });
  }

  refreshStatus(data: TbData, type: number): void {
    var isAllChecked: boolean = true;
    if (type == 1) { //模板
      for (let item of this.tplTableData) {
        isAllChecked = isAllChecked && item.isChecked;
      };
      this.isTplAllChecked = isAllChecked;
    }
    if (type == 2) { //样品
      for (let item of this.tplSpecTableData) {
        isAllChecked = isAllChecked && item.isChecked;
      };
      this.isSpecAllChecked = isAllChecked;
    }
  }

  checkAll(value: boolean, type: number): void {
    if (type == 1) {
      this.tplTableData.forEach(data => data.isChecked = value);
    } else {
      this.tplSpecTableData.forEach(data => data.isChecked = value);
    }

  }

  orgClickEvent($event) {
    console.log($event);
    this.selectOrgName = $event.node.title;
    this.selectOrgCode = $event.node.key;
    this.orgTree.nzSelectedKeys = [this.selectOrgCode];
    this.loadTplIdByOrgId($event.node.key);
  }

  tplClick(item: TbData) {
    this.selectTplId = item.id;
    this.selectTplName = item.name;
    this.loadSpecIdsByTplId(item.id);
  }

  saveOrg() {
    var checkedOrgNodes: Array<NzTreeNode> = this.orgTree.getCheckedNodeList();
    var orgList = new Array<string>();
    for (let item of checkedOrgNodes) {
      this.getNodes(item, orgList);
    }
    var orgStr = "";
    for (let item of orgList) {
      orgStr += item + ",";
    }
    this._uTplService.postAddOrUpdateUserOrgsByUserId(orgStr, this.userItem.id).subscribe((res: HtmlDataOperRetDto) => {
      this.message.info(res.message);
    });
  }

  getNodes(orgNode: NzTreeNode, orgList: Array<string>) {
    orgList.push(orgNode.key);
    if (orgNode.children.length > 0) {
      for (let item of orgNode.children) {
        this.getNodes(item, orgList);
      }
    }
  }

  saveTpl() {
    if (this.tplTableData.length <= 0) {
      this.message.info("当前没有模板！");
      return;
    }
    if (this.isTplAllChecked) {
      this._uTplService.postAddOrUpdateOrgTplsByUserId(this.selectOrgCode, "-1", this.userItem.id) // -1表示全选
        .subscribe((res: HtmlDataOperRetDto) => {
          this.message.info(res.message);
        });
    } else {
      var tplIds = "";
      for (let item of this.tplTableData) {
        if (item.isChecked) {
          tplIds += item.id.toString() + ",";
        }
      }
      this._uTplService.postAddOrUpdateOrgTplsByUserId(this.selectOrgCode, tplIds, this.userItem.id)
        .subscribe((res: HtmlDataOperRetDto) => {
          this.message.info(res.message);
        });
    }
  }

  saveSpec() {
    if (this.tplSpecTableData.length <= 0) {
      this.message.info("当前没有样品！");
      return;
    }
    if (this.isSpecAllChecked) {
      this._uTplService.postAddOrUpdateTplSpecByTplIdAndUserId(this.selectTplId, "-1", this.userItem.id) // -1表示全选
        .subscribe((res: HtmlDataOperRetDto) => {
          this.message.info(res.message);
        });
    } else {
      var tplSpecIds = "";
      for (let item of this.tplSpecTableData) {
        if (item.isChecked) {
          tplSpecIds += item.id.toString() + ",";
        }
      }
      this._uTplService.postAddOrUpdateTplSpecByTplIdAndUserId(this.selectTplId, tplSpecIds, this.userItem.id)
        .subscribe((res: HtmlDataOperRetDto) => {
          this.message.info(res.message);
        });
    }
  }
}
