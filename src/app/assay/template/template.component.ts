import { Component, OnInit, Injector } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AddTemplateComponent } from './add-template/add-template.component';
import { AppComponentBase } from '@shared/component-base';
import { Assay_TplServiceProxy, EditTplDto, EditTplElementDto, EditTplSpecimenDto, OrgTreeNodeDto, OrgServiceProxy, Assay_UnitServiceProxy, Assay_SpecimenServiceProxy, HtmlSelectDto, Assay_ElementServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditTemplateComponent } from './edit-template/edit-template.component';
import { AddTplSpecimenComponent } from './add-tplSpecimen/add-tplSpecimen.component';
import { AddTplElementComponent } from './add-tplElement/add-tplElement.component';
import { EditTplSpecimenComponent } from './edit-tplSpecimen/edit-tplSpecimen.component';
import { EditTplElementComponent } from './edit-tplElement/edit-tplElement.component';
import { OrderSpecimenComponent } from './order-specimen/order-specimen.component';
import { OrderElementComponent } from './order-element/order-element.component';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styles: []
})
export class TemplateComponent extends AppComponentBase implements OnInit {
  selectedOrgItem: OrgTreeNodeDto;
  templateTitle = "模板";
  selectedTplItem: EditTplDto;
  specimenTitle = "样品";
  selectedSpecimenItem: EditTplSpecimenDto;
  elementTitle = "元素";
  orgTree: OrgTreeNodeDto[];
  orgCode: string;
  oldCode: string;

  templateList: EditTplDto[];
  specimenList: EditTplSpecimenDto[];
  elementList: EditTplElementDto[];

  searchTplName: string;

  listOfSpecimen: HtmlSelectDto[];
  listOfUnit: HtmlSelectDto[];
  listOfElement: HtmlSelectDto[];
  confirmOk;

  constructor(public msg: NzMessageService, private injector: Injector, private _service: Assay_TplServiceProxy, private _orgService: OrgServiceProxy, private _specService: Assay_SpecimenServiceProxy, private _unitService: Assay_UnitServiceProxy, private _eleService: Assay_ElementServiceProxy, private _modalService: NzModalService) {
    super(injector);
  }

  ngOnInit() {
    this._orgService.getOrgTreeByZtCode()
      .subscribe((res: OrgTreeNodeDto[]) => {
        this.orgTree = res;
      });

    this._specService.getHtmlSelectSpecimens()
      .subscribe(res => {
        this.listOfSpecimen = res;
      });

    this._unitService.getHtmlSelectUnits()
      .subscribe(res => {
        this.listOfUnit = res;
      });

    this._eleService.getHtmlSelectElements()
      .subscribe(res => {
        this.listOfElement = res;
      });
  }

  updateAfterSpecimemRefresh() {
    this.elementList = [];
    this.elementTitle = "元素";
    this.selectedSpecimenItem = null;
  }
  updateAfterElementRefresh() {
    this.elementList = [];
    this.elementTitle = "元素";
    this.selectedSpecimenItem = null;
  }

  updateAfterTemplateRefresh() {
    this.specimenList = [];
    this.elementList = [];
    this.specimenTitle = "样品";
    this.elementTitle = "元素";
    this.selectedTplItem = null;
    this.selectedSpecimenItem = null;
  }

  btnSearch() {
    this.refreshTpl();
  }

  refreshTpl(): void {
    if (this.searchTplName) {
      this.searchTplName = this.searchTplName.trim();
    }
    this._service.getTpls(this.orgCode, this.searchTplName)
      .subscribe((res: any) => {
        this.templateList = res;
        if (this.templateList.length === 0) {
          this.msg.warning("该条件下没有化验模板");
        }
        this.updateAfterTemplateRefresh();
      });
  }

  refreshSpecimen(): void {
    this._service.getTplSpecimensByTplId(this.selectedTplItem.id)
      .subscribe((res: any) => {
        this.specimenList = res;
        if (this.specimenList.length === 0) {
          this.msg.warning("该模板下没有样品！");
        }
        this.updateAfterSpecimemRefresh();
      });
  }

  refreshElement(): void {
    this._service.getTplElementsByTplSpecimenId(this.selectedSpecimenItem.id)
      .subscribe((res: any) => {
        this.elementList = res;
        if (this.elementList.length === 0) {
          this.msg.warning("该样品下没有元素！");
        }
      });
  }

  createTpl(): void {
    if (this.orgCode) {
      this.showConfirm();
    } else {
      this.msg.warning("请先选择组织！");
    }
  }

  showAddTpl() {
    this.modalHelper.open(AddTemplateComponent, { orgCode: this.orgCode }, 'md', {
      nzMask: true,
    })
      .subscribe(() => {
        this.refreshTpl();
      });
  }

  showConfirm(): void {
    this.confirmOk = false;
    let orgName = this.getOrgNameByOrgCode();
    this._modalService.confirm({
      nzTitle: '<i>确定要在 ' + orgName + ' 添加模板么？</i>',
      nzContent: '<b>你现在选择的组织是：' + orgName + '</b>',
      nzOnOk: () => this.showAddTpl()
    });
  }

  getOrgNameByOrgCode() {
    let orgName = null;
    for (let tempNode of this.orgTree) {
      orgName = this.traverseOrgDto(tempNode, this.orgCode);
      if (orgName) {
        break;
      }
    }
    return orgName;
  }

  traverseOrgDto(orgNode: OrgTreeNodeDto, orgCode: string) {
    let orgName = null;
    if (orgNode.key === orgCode) {
      orgName = orgNode.title;
    } else if (!orgNode.isLeaf) {
      for (let tempNode of orgNode.children) {
        orgName = this.traverseOrgDto(tempNode, orgCode);
        if (orgName) {
          break;
        }
      }
    }
    return orgName;
  }

  createSpecimen(): void {
    if (this.selectedTplItem) {
      this.modalHelper.open(AddTplSpecimenComponent, {
        template: this.selectedTplItem, listOfSpecimen: this.listOfSpecimen,
        listOfUnit: this.listOfUnit
      }, 'md', {
          nzMask: true,
        })
        .subscribe(() => {
          this.refreshSpecimen();
        });
    } else {
      this.msg.warning("请先选择模板！");
    }
  }

  createElement(): void {
    if (this.selectedSpecimenItem) {
      this.modalHelper.open(AddTplElementComponent, { specimen: this.selectedSpecimenItem, listOfElement: this.listOfElement, listOfUnit: this.listOfUnit }, 'md', {
        nzMask: true,
      })
        .subscribe(() => {
          this.refreshElement();
        });
    } else {
      this.msg.warning("请先选择样品！");
    }
  }

  specClick(item: EditTplSpecimenDto): void {
    this.selectedSpecimenItem = item;
    this.refreshElement();
    this.elementTitle = item.specName + " 的元素";
  }

  tplClick(item: EditTplDto): void {
    this.selectedTplItem = item;
    this.refreshSpecimen();
    this.specimenTitle = item.tplName + " 的样品";
  }

  editTpl(item: EditTplDto) {
    this.modalHelper.open(EditTemplateComponent, { item: item }, 'md', {
      nzMask: true,
    })
      .subscribe((ret: any) => {
        this.refreshTpl();
      });
  }

  deleteTpl(item: EditTplDto) {
    this._service.delTpl(item.id)
      .subscribe(() => {
        this.msg.info("删除成功!");
        this.refreshTpl();
      });
  }

  editTplSpecimen(item: EditTplSpecimenDto) {
    this.modalHelper.open(EditTplSpecimenComponent, {
      item: item, specId: item.specId.toString(), unitId: item.unitId.toString(), listOfSpecimen: this.listOfSpecimen,
      listOfUnit: this.listOfUnit
    }, 'md', {
        nzMask: true,
      })
      .subscribe((ret: any) => {
        this.refreshSpecimen();
      });
  }

  reorder(lx: string) {
    if (lx === 'specimen') {
      if (this.specimenList && this.specimenList.length === 0) {
        this.msg.info('当前没有可排序的元素!');
        return;
      }
      this.modalHelper.open(OrderSpecimenComponent, {
        list: this.specimenList, title: this.specimenTitle, lx: lx
      }, 'md', {
          nzMask: true,
        })
        .subscribe((ret: any) => {
          this.refreshSpecimen();
        });
    } else {
      if (this.elementList && this.elementList.length === 0) {
        this.msg.info('当前没有可排序的元素!');
      }
      this.modalHelper.open(OrderElementComponent, {
        list: this.elementList, title: this.elementTitle, lx: lx
      }, 'md', {
          nzMask: true,
        })
        .subscribe((ret: any) => {
          this.refreshElement();
        });
    }
  }

  deleteTplSpecimen(item: EditTplSpecimenDto) {
    this._service.deleteTplSpecimen(item.id)
      .subscribe(() => {
        this.msg.info("删除成功!");
        this.refreshSpecimen();
      });
  }

  editTplElement(item: EditTplElementDto) {
    this.modalHelper.open(EditTplElementComponent, {
      item: item, elementId: item.elementId.toString(), unitId: item.unitId.toString(), listOfElement: this.listOfElement,
      listOfUnit: this.listOfUnit
    }, 'md', {
        nzMask: true,
      })
      .subscribe((ret: any) => {
        this.refreshElement();
      });
  }

  deleteTplElement(item: EditTplElementDto) {
    this._service.deleteTplElement(item.id)
      .subscribe(() => {
        this.msg.info("删除成功!");
        this.refreshElement();
      });
  }

}
