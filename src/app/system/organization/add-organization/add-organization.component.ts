import { Component, Input, Injector } from '@angular/core';
import { OrgServiceProxy, CreateOrgDto, EditOrgDto } from '@shared/service-proxies/service-proxies';
import { ModalComponentBase } from '@shared/component-base';

@Component({
  selector: 'app-add-organization',
  templateUrl: './add-organization.component.html',
  styles: []
})
export class AddOrganizationComponent extends ModalComponentBase {
  item: CreateOrgDto = new CreateOrgDto();
  @Input()
  parentItem: EditOrgDto;


  constructor(
    injector: Injector,
    private _service: OrgServiceProxy
  ) {
    super(injector);
  }

  save(): void {
    this.item.parentId = this.parentItem.id;
    this._service.addOrgInfo(this.item)
      .finally(() => { this.saving = false; })
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.success();
      });
  }
}
