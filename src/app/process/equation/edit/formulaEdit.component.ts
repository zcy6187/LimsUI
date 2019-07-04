import { Component, OnInit, Input, Injector } from '@angular/core';
import { Assay_FormulaServiceProxy, CreateFormulaDto, AssayFormulaPram, AssayEleFormula, HtmlDataOperRetDto } from '@shared/service-proxies/service-proxies';
import { ModalComponentBase } from '@shared/component-base';
import { MessageService } from 'abp-ng2-module/dist/src/message/message.service';

@Component({
  selector: 'app-edit',
  templateUrl: './formulaEdit.component.html',
  styles: []
})
export class FormulaEditComponent extends ModalComponentBase implements OnInit {
  formulaList: Array<AssayEleFormula>;
  pramList: Array<AssayFormulaPram>;
  curFormula: AssayEleFormula;
  @Input()
  eleId;
  isFormHidden: boolean;
  formStatus: string;

  constructor(private injector: Injector, private _formulaService: Assay_FormulaServiceProxy, private msg: MessageService) {
    super(injector);
  }

  ngOnInit() {
    this.getFormulasByEleId();
    this.curFormula = new AssayEleFormula();
    this.isFormHidden = true;
  }

  getFormulasByEleId() {
    this._formulaService.getFormulaByEleId(this.eleId).subscribe((res: Array<AssayEleFormula>) => {
      this.formulaList = res;
    });
  }

  getPramsByFormulaId() {
    this._formulaService.getPramsByFormulaId(this.curFormula.id).subscribe((res: Array<AssayFormulaPram>) => {
      this.pramList = res;
    });
  }

  addFormula() {
    this.curFormula = new AssayEleFormula();
    this.isFormHidden = false;
    this.formStatus = "新增公式！";
  }

  showPrams(eve) {
    for (let item of this.formulaList) {
      if (item.id == eve) {
        this.curFormula = item;
        this.getPramsByFormulaId();
        this.formStatus = "编辑公式！";
        this.isFormHidden = false;
        break;
      }
    }
  }

  edit(eve) {
    for (let item of this.formulaList) {
      if (item.id == eve) {
        this.curFormula = item;
        this.formStatus = "编辑公式！"
        this.isFormHidden = false;
        this.showPrams(eve);
        break;
      }
    }
  }

  setDefault(inputId) {
    this._formulaService.setDefaultFormulaById(inputId).subscribe(res => {
      this.message.info(res.message);
      this.getFormulasByEleId();
    });
  }

  delete(eve) {
    this._formulaService.deleteFormulaByFormulaId(eve).subscribe((res: HtmlDataOperRetDto) => {
      this.msg.info(res.message);
      this.getFormulasByEleId();
    });
  }

  save() {
    if (!this.curFormula.name) {
      this.msg.warn("公式名称不能为空！");
      return;
    }
    if (!this.curFormula.formulaExp) {
      this.msg.warn("公式不能为空！");
      return;
    }
    this.curFormula.eleId = this.eleId;
    if (this.curFormula.id > 0) {
      this.updateFormulaToDb();
    } else {
      this.addFormulaToDb();
    }
  }

  updateFormulaToDb() {
    this._formulaService.updateFormulaById(this.curFormula.id, this.curFormula).subscribe((res: HtmlDataOperRetDto) => {
      if (res.code > 0) {
        this.msg.info(res.message);
        this.getFormulasByEleId();
        this.getPramsByFormulaId();
      } else {
        this.msg.warn(res.message);
      }
    });
  }
  addFormulaToDb() {
    this._formulaService.addFormulaById(this.eleId, this.curFormula).subscribe((res: HtmlDataOperRetDto) => {
      if (res.code > 0) {
        this.msg.info(res.message);
        this.getFormulasByEleId();
        this.getPramsByFormulaId();
      } else {
        this.msg.warn(res.message);
      }
    });
  }

}
