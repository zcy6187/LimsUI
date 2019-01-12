import { Component, Injector } from '@angular/core';
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from '@shared/component-base/paged-listing-component-base';
import {
  Assay_UnitServiceProxy,
  PagedResultDtoOfUnitDto,
  UnitDto
} from '@shared/service-proxies/service-proxies';
import { CreateUnitComponent } from './create-unit/create-unit.component';
import { EditUnitComponent } from './edit-unit/edit-unit.component';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styles: []
})
export class UnitComponent extends PagedListingComponentBase<UnitDto>  {


  constructor(public injector: Injector, public _assayBaseServiceProxy: Assay_UnitServiceProxy
  ) {
    super(injector);
  }

  // 分页加载数据
  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._assayBaseServiceProxy.getPages(request.skipCount, request.maxResultCount)
      .finally(() => {
        finishedCallback();
      }).subscribe((result: PagedResultDtoOfUnitDto) => {
        this.dataList = result.items;
        this.totalItems = result.totalCount;
      });
  }

  // 添加新元素
  create(): void {
    this.modalHelper
      .open(CreateUnitComponent, {}, 'md', {
        nzMask: true,
      })
      .subscribe(isSave => {
        if (isSave) {
          this.refresh();
        }
      });
  }

  // 编辑元素
  edit(item: UnitDto): void {
    this.modalHelper
      .open(EditUnitComponent, { instanceItem: item }, 'md', {
        nzMask: true,
      })
      .subscribe(isSave => {
        if (isSave) {
          this.refresh();
        }
      });
  }

  // 删除元素
  protected delete(entity: UnitDto): void {
    abp.message.confirm(
      '要删除该计量单位么： \'' + entity.name + '\'?',
      '永久删除',
      (result: boolean) => {
        if (result) {
          this._assayBaseServiceProxy
            .delete(entity.id)
            .finally(() => {
              abp.notify.info('删除计量单位: ' + entity.name);
              this.refresh();
            })
            .subscribe(() => { });
        }
      },
    );
  }

}
