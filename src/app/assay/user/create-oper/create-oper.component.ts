import { Component, OnInit, Injector } from '@angular/core';
import { CreateAssayUserDto, Assay_UserServiceProxy, EditAssayUserDto } from '@shared/service-proxies/service-proxies';
import { ModalComponentBase } from '@shared/component-base';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-create-oper',
  templateUrl: './create-oper.component.html',
  styles: []
})
export class CreateAssayUserComponent extends ModalComponentBase {

  element: CreateAssayUserDto = new CreateAssayUserDto();
  saving = false;


  constructor(
    injector: Injector,
    private _assayBaseService: Assay_UserServiceProxy,
    private msg: NzMessageService
  ) {
    super(injector);
  }

  save(): void {
    this.saving = true;
    this._assayBaseService.add(this.element)
      .finally(() => { this.saving = false; })
      .subscribe((res: any) => {
        this.notify.info(res);
      });
  }

}
