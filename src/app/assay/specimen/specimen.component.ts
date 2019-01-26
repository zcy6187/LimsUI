import { Component, OnInit, Injector } from '@angular/core';
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from '@shared/component-base/paged-listing-component-base';
import {
  Assay_SpecimenServiceProxy,
  PagedResultDtoOfSpecimenDto,
  SpecimenDto
} from '@shared/service-proxies/service-proxies';
import { CreateSpecimenComponent } from './create-specimen/create-specimen.component';
import { EditSpecimenComponent } from './edit-specimen/edit-specimen.component';

@Component({
  selector: 'app-specimen',
  templateUrl: './specimen.component.html',
  styles: []
})
export class SpecimenComponent extends PagedListingComponentBase<SpecimenDto>  {
  searchTxt;

  constructor(public injector: Injector, public _assayBaseServiceProxy: Assay_SpecimenServiceProxy
  ) {
    super(injector);
    this.searchTxt = "";
  }

  // 分页加载数据
  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._assayBaseServiceProxy.getPages(request.skipCount, request.maxResultCount, this.searchTxt)
      .finally(() => {
        finishedCallback();
      }).subscribe((result: PagedResultDtoOfSpecimenDto) => {
        this.dataList = result.items;
        this.totalItems = result.totalCount;
      });
  }

  loadData() {
    this._assayBaseServiceProxy.getPages(0, this.pageSize, this.searchTxt)
      .subscribe((result: PagedResultDtoOfSpecimenDto) => {
        this.dataList = result.items;
        this.totalItems = result.totalCount;
      });
  }

  // 添加新元素
  create(): void {
    this.modalHelper
      .open(CreateSpecimenComponent, {}, 'md', {
        nzMask: true,
      })
      .subscribe(isSave => {
        this.refresh();
      });
  }

  // 编辑元素
  edit(item: SpecimenDto): void {
    this.modalHelper
      .open(EditSpecimenComponent, { instanceItem: item }, 'md', {
        nzMask: true,
      })
      .subscribe(isSave => {
        this.refresh();
      });
  }

  // 删除元素
  protected delete(entity: SpecimenDto): void {
    abp.message.confirm(
      '要删除该样品么： \'' + entity.name + '\'?',
      '永久删除',
      (result: boolean) => {
        if (result) {
          this._assayBaseServiceProxy
            .delete(entity.id)
            .finally(() => {
              abp.notify.info('删除样品: ' + entity.name);
              this.refresh();
            })
            .subscribe(() => { });
        }
      },
    );
  }

}
