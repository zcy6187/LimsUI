import { Component, OnInit, Injector } from '@angular/core';
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from '@shared/component-base/paged-listing-component-base';
import {
  Assay_UserServiceProxy,
  CreateAssayUserDto,
  EditAssayUserDto,
} from '@shared/service-proxies/service-proxies';
import { CreateAssayUserComponent } from './create-oper/create-oper.component';
import { EditAssayUserComponent } from './edit-oper/edit-oper.component';
import { AppComponentBase } from '@shared/component-base';

@Component({
  selector: 'app-assay-user',
  templateUrl: './user.component.html',
  styles: []
})
export class AssayUserComponent extends AppComponentBase implements OnInit {
  searchTxt;
  dataList: Array<EditAssayUserDto>;

  constructor(public injector: Injector,
    public _AssayBaseServiceProxy: Assay_UserServiceProxy
  ) {
    super(injector);
    this.searchTxt = "";
  }


  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this._AssayBaseServiceProxy.getAssayOpers(this.searchTxt)
      .subscribe((res: Array<EditAssayUserDto>) => {
        this.dataList = res;
      });
  }

  // 添加新元素
  create(): void {
    this.modalHelper
      .open(CreateAssayUserComponent, {}, 'md', {
        nzMask: true,
      })
      .subscribe(() => {
        this.refresh();
      });
  }

  // 编辑元素
  edit(item: EditAssayUserDto): void {
    this.modalHelper
      .open(EditAssayUserComponent, { element: item }, 'md', {
        nzMask: true,
      })
      .subscribe(() => {
        this.refresh();
      });
  }

  // 删除元素
  protected delete(entity: EditAssayUserDto): void {
    abp.message.confirm(
      '要删除该元素么： \'' + entity.userName + '\'?',
      '永久删除',
      (result: boolean) => {
        if (result) {
          this._AssayBaseServiceProxy
            .delete(entity.id)
            .finally(() => {
              abp.notify.info('删除操作员：' + entity.userName);
              this.refresh();
            })
            .subscribe(() => { });
        }
      },
    );
  }

}
