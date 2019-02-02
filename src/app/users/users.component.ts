import { Component, OnInit, Injector } from '@angular/core';
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from '@shared/component-base/paged-listing-component-base';
import {
  PagedResultDtoOfUserDto,
  UserServiceProxy,
  UserDto,
  SelfUserServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { CreateUserComponent } from '@app/users/create-user/create-user.component';
import { EditUserComponent } from '@app/users/edit-user/edit-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [],
})
export class UsersComponent extends PagedListingComponentBase<UserDto> {

  searchTxt = '';

  constructor(injector: Injector,
    private _userService: UserServiceProxy,
    private _selfUserSevice: SelfUserServiceProxy) {
    super(injector);
  }

  protected fetchDataList(
    request: PagedRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    this._userService
      .getAll(request.skipCount, request.maxResultCount)
      .finally(() => {
        finishedCallback();
      })
      .subscribe((result: PagedResultDtoOfUserDto) => {
        this.dataList = result.items;
        this.totalItems = result.totalCount;
      });
  }

  protected research() {
    if (this.searchTxt.length > 0) {
      this._selfUserSevice.searchUserByUserName(this.searchTxt).subscribe((res: UserDto[]) => {
        this.dataList = res;
        this.totalItems = res.length;
      });
    } else {
      this._userService
        .getAll(0, 10)
        .subscribe((result: PagedResultDtoOfUserDto) => {
          this.dataList = result.items;
          this.totalItems = result.totalCount;
        });
    }

  }

  protected delete(entity: UserDto): void {
    this.message.confirm(
      "Delete user '" + entity.fullName + "'?",
      (result: boolean) => {
        if (result) {
          this._userService.delete(entity.id).subscribe(() => {
            this.notify.info('Deleted User: ' + entity.fullName);
            this.refresh();
          });
        }
      },
    );
  }

  create(): void {
    this.modalHelper
      .open(CreateUserComponent, {}, 'md', {
        nzMask: true
      })
      .subscribe(isSave => {
        if (isSave) {
          this.refresh();
        }
      });
  }

  edit(item: UserDto): void {
    this.modalHelper
      .open(EditUserComponent, { id: item.id }, 'md', {
        nzMask: true
      })
      .subscribe(isSave => {
        if (isSave) {
          this.refresh();
        }
      });
  }

  resetPass(item: UserDto): void {
    this._userService.resetUserPassword(item.id).subscribe(() => {
      this.message.info("重置成功！");
    })
  }
}
