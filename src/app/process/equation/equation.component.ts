import { Component, OnInit, Injector } from '@angular/core';
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from '@shared/component-base/paged-listing-component-base';
import {
  Assay_ElementServiceProxy,
  PagedResultDtoOfElementDto,
  ElementDto,
} from '@shared/service-proxies/service-proxies';
import { FormulaEditComponent } from './edit/formulaEdit.component';
import { ConstEditorComponent } from './const-editor/const-editor.component';

@Component({
  selector: 'app-equation',
  templateUrl: './equation.component.html',
  styles: []
})
export class EquationComponent extends PagedListingComponentBase<ElementDto>  {
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

  // 编辑元素
  editEquation(item: ElementDto): void {
    this.modalHelper
      .open(FormulaEditComponent, { eleId: item.id }, 'lg', {
        nzMask: true,
      })
      .subscribe();
  }

  // 编辑常数
  editConst(item: ElementDto): void {
    this.modalHelper
      .open(ConstEditorComponent, { curElementId: item.id }, 'lg', {
        nzMask: true,
      })
      .subscribe();
  }
}

