import { Component, OnInit, Injector } from '@angular/core';
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from '@shared/component-base/paged-listing-component-base';
import {
  Assay_ElementServiceProxy,
  PagedResultDtoOfElementDto,
  ElementDto,
  CreateElementDto
} from '@shared/service-proxies/service-proxies';
import { CreateElementComponent } from './create-element/create-element.component';
import { EditElementComponent } from './edit-element/edit-element.component';

@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styles: []
})
export class ElementComponent extends PagedListingComponentBase<ElementDto>  {
  searchTxt;

  constructor(public injector: Injector, public _AssayBaseServiceProxy: Assay_ElementServiceProxy
  ) {
    super(injector);
    this.searchTxt = "";
  }

  // 分页加载数据
  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._AssayBaseServiceProxy.getElements(request.skipCount, request.maxResultCount, this.searchTxt)
      .finally(() => {
        finishedCallback();
      }).subscribe((result: PagedResultDtoOfElementDto) => {
        this.dataList = result.items;
        this.totalItems = result.totalCount;
      });
  }

  loadData() {
    this._AssayBaseServiceProxy.getElements(0, this.pageSize, this.searchTxt)
      .subscribe((result: PagedResultDtoOfElementDto) => {
        this.dataList = result.items;
        this.totalItems = result.totalCount;
      });
  }

  // 添加新元素
  create(): void {
    this.modalHelper
      .open(CreateElementComponent, {}, 'md', {
        nzMask: true,
      })
      .subscribe(isSave => {
        if (isSave) {
          this.refresh();
        }
      });
  }

  // 编辑元素
  edit(item: ElementDto): void {
    this.modalHelper
      .open(EditElementComponent, { element: item }, 'md', {
        nzMask: true,
      })
      .subscribe(isSave => {
        if (isSave) {
          this.refresh();
        }
      });
  }

  // 删除元素
  protected delete(entity: ElementDto): void {
    abp.message.confirm(
      '要删除该元素么： \'' + entity.name + '\'?',
      '永久删除',
      (result: boolean) => {
        if (result) {
          this._AssayBaseServiceProxy
            .deleteElement(entity.id)
            .finally(() => {
              abp.notify.info('Deleted Role: ' + entity.name);
              this.refresh();
            })
            .subscribe(() => { });
        }
      },
    );
  }

}
