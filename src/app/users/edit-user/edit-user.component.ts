import { Component, OnInit, Injector, Input, AfterViewInit } from '@angular/core';
import { RoleDto, RoleServiceProxy, ListResultDtoOfPermissionDto, UserServiceProxy, UserDto, UserZtDto, ZtCodeServiceProxy } from '@shared/service-proxies/service-proxies';
import { Validators, FormControl, AbstractControl } from '@angular/forms';
import { ModalComponentBase } from '@shared/component-base';
import { CodeFill } from '@ant-design/icons-angular/icons/public_api';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styles: []
})
export class EditUserComponent extends ModalComponentBase implements OnInit {


  @Input() id: number;
  user: UserDto = null;
  roles: RoleDto[] = null;
  roleList = [];
  ztCodeList = [];
  userZtCodeList: Array<UserZtDto> = [];
  ztCodeDtoList = [];


  constructor(
    injector: Injector,
    private _userService: UserServiceProxy,
    private _ztCodeService: ZtCodeServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.fetchData();
  }



  fetchData(): void {
    this._userService.getRoles()
      .subscribe((result) => {
        this.roles = result.items;

        this._userService.get(this.id)
          .subscribe((result) => {
            this.user = result;
            this.roles.forEach((item) => {
              this.roleList.push({
                label: item.displayName, value: item.name, checked: this.userInRole(item, this.user)
              });
            });
          });

        this._userService.getUserZt(this.id)
          .subscribe(res => {
            this.userZtCodeList = res;

            this._ztCodeService.getAllZtCode()
              .subscribe(res => {
                this.ztCodeDtoList = res;
                res.forEach(item => {
                  this.ztCodeList.push({
                    label: item.name, value: item.code, checked: this.userInZtCode(item.code)
                  })
                });
              });
          });
      });
  }

  userInRole(role: RoleDto, user: UserDto): boolean {
    return user.roleNames.indexOf(role.normalizedName) !== -1;
  }

  userInZtCode(code: string): boolean {
    for (let item of this.userZtCodeList) {
      if (item.ztCode === code) {
        return true;
      }
    }
    return false;
  }

  getZtId(code) {
    for (let item of this.ztCodeDtoList) {
      if (item.code === code) {
        return item.id;
      }
    }
    return 0;
  }

  save(): void {
    let tmpRoleNames = [];
    this.roleList.forEach((item) => {
      if (item.checked) {
        tmpRoleNames.push(item.value);
      }
    });

    let tmpZtCode = [];
    this.ztCodeList.forEach(item => {
      if (item.checked) {
        let tmpZt: UserZtDto = new UserZtDto();
        tmpZt.ztCode = item.value;
        tmpZt.ztId = this.getZtId(item.value);
        tmpZtCode.push(tmpZt);
      }
    });
    this.user.ztCodes = tmpZtCode;

    this.user.roleNames = tmpRoleNames;

    this._userService.update(this.user)
      .finally(() => { this.saving = false; })
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.success();
      });
  }
}
