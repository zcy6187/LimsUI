import { Component, Injector } from '@angular/core';
import { CreateUnitDto, Assay_UnitServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalComponentBase } from '@shared/component-base';

@Component({
  selector: 'app-create-unit',
  templateUrl: './create-unit.component.html',
  styles: []
})
export class CreateUnitComponent extends ModalComponentBase {

  item: CreateUnitDto = new CreateUnitDto();


  constructor(
    injector: Injector,
    private _assayBaseService: Assay_UnitServiceProxy
  ) {
    super(injector);
    console.log(this.l('unit.add'));
  }

  save(): void {
    this._assayBaseService.add(this.item)
      .finally(() => { this.saving = false; })
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.success();
      });
  }



}
