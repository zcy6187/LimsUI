import { Component, OnInit, Injector } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
import { OrgTreeNodeDto, OrgDto, CreateOrgDto, EditOrgDto, OrgServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/component-base/app-component-base';
import { AddOrganizationComponent } from './add-organization/add-organization.component';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styles: []
})
export class OrganizationComponent extends AppComponentBase implements OnInit {

  nodes: OrgTreeNodeDto[];
  title = "测试";
  editDto: EditOrgDto;
  createDto: CreateOrgDto;
  isEdit = false;
  isSave = false;

  constructor(private _baseService: OrgServiceProxy, private injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.refresh();
  }

  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
    const selectItem = event.node.origin;
    const selectId = selectItem.id;
    this.getSingleOrgInfo(selectId);
  }

  private getSingleOrgInfo(inputId: any) {
    this._baseService.getSingleOrgInfo(inputId)
      .subscribe((res: EditOrgDto) => {
        this.editDto = res;
        this.isEdit = true;
      });
  }

  // 添加组织
  add(): void {
    console.log("add");
    this.modalHelper
      .open(AddOrganizationComponent, { parentItem: this.editDto }, 'md', {
        nzMask: true,
      })
      .subscribe(isSave => {
        if (isSave) {
          this.refresh();
        }
      });
  }

  refresh(): void {
    this._baseService.getOrgTree()
      .finally(() => console.log('OK'))
      .subscribe((res: OrgTreeNodeDto[]) => {
        this.nodes = res;
        this.isEdit = false;
      });
  }

  save(): void {
    this._baseService.editOrgInfo(this.editDto)
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.refresh();
      });
  }

  delete(): void {
    this._baseService.deleteOrgInfo(this.editDto.id)
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.refresh();
      });
  }

}
