import { Component, OnInit, Input, Injector } from '@angular/core';
import {
  TplDto, EditVUserTplDto, OrgTreeNodeDto, Assay_TplServiceProxy,
  EditTplDto, CreateUserTplDto, Assay_UserTplServiceProxy, OrgServiceProxy, TplSpecimenDto, SpecimenDto, EditTplSpecimenDto
} from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { ModalComponentBase } from '@shared/component-base';
import { TbData } from '../tb-data';
import { Observable } from 'rxjs';

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
  @Input()
  userSpecimenList: Array<TplSpecimenDto>;
  searchTplName;
  orgCode;
  templateList: Array<EditTplDto>;
  specimenList: Array<EditTplSpecimenDto>;
  selectedTplItem: TplDto;
  bindSpecimen: Array<TbData>;
  allChecked: boolean;
  indeterminate; // 列表全选中间态
  selectTplName;

  constructor(private msg: NzMessageService, private _tplService: Assay_TplServiceProxy,
    private _userTplService: Assay_UserTplServiceProxy, private _orgService: OrgServiceProxy,
    private injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    if (!this.userTplList) {
      this.userTplList = new Array<TplDto>();
    }
    this.templateList = new Array<EditTplDto>();
    this.bindSpecimen = new Array<TbData>();
  }

  showSpec(data: TplDto): void {
    this.selectedTplItem = data;
    this.selectTplName = data.tplName;
    this._tplService.getTplSpecimensByTplId(data.id)
      .subscribe((res: any) => {
        this.specimenList = res;
        if (this.specimenList.length === 0) {
          this.msg.warning("该模板下没有样品！");
        } else {
          let tbInfo = new Array<TbData>();
          let isAllChecked = this.chargeIsAllChecked();
          this.allChecked = isAllChecked;
          for (let item of res) {
            let tb = new TbData();
            tb.id = item.id;
            tb.name = item.specName;
            if (isAllChecked) {
              tb.isChecked = true;
            } else {
              tb.isChecked = this.chargeSingleIsChecked(item.id);
            }
            tbInfo.push(tb);
          }
          this.bindSpecimen = tbInfo;
        }
      });
  }

  // 如果没有特定的模板信息，即为全选
  chargeIsAllChecked(): boolean {
    let specArray = new Array<number>();
    for (let item of this.userSpecimenList) {
      if (item.tplId == this.selectedTplItem.id) {
        specArray = item.specimenIds;
        break;
      }
    }
    if (specArray.length > 0) {
      return false;
    }
    return true;
  }

  // 含有模板，模板下样品含有该id，则为true
  chargeSingleIsChecked(specId: number): boolean {
    let specArray = new Array<number>();
    for (let item of this.userSpecimenList) {
      if (item.tplId == this.selectedTplItem.id) {
        specArray = item.specimenIds;
        break;
      }
    }
    if (specArray.length > 0) {
      return specArray.indexOf(specId) >= 0
    }
    return false;
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
      tempTokenTpl.tplName = item.tplName + "-" + item.orgName;
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
      this.msg.warning("至少选择一个化验模板!");
      return;
    }
    let tplIds = "";
    for (const data of this.userTplList) {
      tplIds += data.id + ",";
    }
    tplIds = tplIds.substr(0, tplIds.length - 1);
    if (this.editVUserTpl.userTplId) {
      this.editVUserTpl.tplIds = tplIds;
      this.editVUserTpl.specimenList = this.userSpecimenList;
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
      addItem.specimens = this.userSpecimenList;
      this._userTplService.addUserTpl(addItem)
        .subscribe(() => {
          this.msg.info("修改成功！");
        },
          () => {
            this.msg.warning("网络连接异常！");
          });
    }
  }

  addAll() {
    console.log("all");
    if (this.templateList.length > 0) {
      const idArray = new Array<number>(); // 存储既有id，用于去重
      const tempTokenList = new Array<TplDto>(); // 存储新模板
      // 原有模板加入新模板
      for (const item of this.userTplList) {
        const tempTokenTpl = new TplDto();
        tempTokenTpl.id = item.id;
        tempTokenTpl.tplName = item.tplName;
        tempTokenList.push(tempTokenTpl);
        idArray.push(item.id);
      }
      // 现有模板加入新模板
      for (const nItem of this.templateList) {
        if (idArray.indexOf(nItem.id) < 0) {
          const tempTokenTpl = new TplDto();
          tempTokenTpl.id = nItem.id;
          tempTokenTpl.tplName = nItem.tplName + "-" + nItem.orgName;
          tempTokenList.push(tempTokenTpl);
          idArray.push(nItem.id);
        }
      }
      this.userTplList = tempTokenList;
    } else {
      this.message.info("当前没有可添加的化验模板！");
    }
  }


  refreshStatus(data: TbData): void {
    const allChecked = this.bindSpecimen.every(value => value.isChecked === true);
    const allUnChecked = this.bindSpecimen.every(value => !value.isChecked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.updateSpecimen();
    console.log(this.userSpecimenList);
  }

  checkAll(value: boolean): void {
    this.bindSpecimen.forEach(data => data.isChecked = value);
  }

  updateSpecimen() {
    // 找一下该模板下是否已经存在记录
    let findItem = null;
    let index = -1;
    for (let item of this.userSpecimenList) {
      index++;
      if (item.tplId == this.selectedTplItem.id) {
        findItem = item;
        break;
      }
    }
    // 如果元素存在，则删除该元素；
    if (findItem) {
      this.userSpecimenList.splice(index, 1);
    }
    // 如果全选，则不进行任何操作
    // 如果不是全选,则获取当前选择项,选择项不为空，则添加该项
    let selectSpecimenIds = new Array<number>();
    if (!this.allChecked) {
      for (let item of this.bindSpecimen) {
        if (item.isChecked) {
          selectSpecimenIds.push(item.id);
        }
      }
    }
    if (selectSpecimenIds.length > 0) {
      let tempItem = new TplSpecimenDto();
      tempItem.tplId = this.selectedTplItem.id;
      tempItem.specimenIds = selectSpecimenIds;
      this.userSpecimenList.push(tempItem);
    }
  }

}
