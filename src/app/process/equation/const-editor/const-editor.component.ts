import { Component, OnInit, Injector, Input } from '@angular/core';
import { CreateConstDto, Assay_FormulaServiceProxy, HtmlDataOperRetDto } from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { ModalComponentBase } from '@shared/component-base';

@Component({
  selector: 'app-const-editor',
  templateUrl: './const-editor.component.html',
  styles: []
})
export class ConstEditorComponent extends ModalComponentBase implements OnInit {
  comptitle;
  constList: Array<CreateConstDto>;
  editItem: CreateConstDto;
  isShowForm: boolean;
  curConstId;

  @Input()
  curElementId;

  constructor(private _service: Assay_FormulaServiceProxy,
    private _msg: NzMessageService,
    private injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.isShowForm = false;
    this.editItem = new CreateConstDto();
    this.editItem.id = 0;
    this.loadConst();
  }

  loadConst() {
    this._service.getConstByEleId(this.curElementId).subscribe((res: CreateConstDto[]) => {
      if (res) {
        this.constList = res;
      } else {
        this.constList = [];
        this.message.info("当前元素没有常数信息！");
      }
    })
  }

  // 添加常数
  addConst() {
    this.comptitle = "添加";
    this.isShowForm = true;
    this.editItem = new CreateConstDto();
    this.editItem.elementId = this.curElementId;
    this.curConstId = 0;
  }

  editConst(constId) {
    this.comptitle = "编辑";
    this._service.getConstByConstId(constId).subscribe((res: CreateConstDto) => {
      this.editItem = res;
      this.isShowForm = true;
      this.curConstId = res.id;
    });
  }

  deleteConst(constId) {
    this._service.deleteConstById(constId).subscribe((res: HtmlDataOperRetDto) => {
      this.message.info(res.message);
      this.loadConst();
    });
  }


  save() {
    if (this.editItem.id > 0) {
      this._service.editConst(this.editItem, this.editItem.id).subscribe((res) => {
        if (res.code > 0) {
          this._msg.info(res.message);
          this.loadConst();
        } else {
          this._msg.warning(res.message);
        }
      })
    } else {
      this.editItem.elementId = this.curElementId;
      this._service.addConst(this.editItem).subscribe((res) => {
        if (res.code > 0) {
          this._msg.info(res.message);
          this.loadConst();
        } else {
          this._msg.warning(res.message);
        }
      })
    }
  }

}
