import { Component, OnInit, Injector } from '@angular/core';
import { CreateUserDto, UserServiceProxy, RoleDto, EditZtCodeDto, ZtCodeServiceProxy, UserZtDto } from '@shared/service-proxies/service-proxies';
import { ModalComponentBase } from '@shared/component-base';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styles: []
})
export class CreateUserComponent extends ModalComponentBase implements OnInit {

  user: CreateUserDto = new CreateUserDto();
  roles: RoleDto[] = null;

  ztCodeList = [];
  roleList = [];
  ztCodeDtoList = [];

  confirmPassword: string = '';

  constructor(
    injector: Injector,
    private _userService: UserServiceProxy,
    private _ztService: ZtCodeServiceProxy,
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

        this.roles.forEach((item) => {
          this.roleList.push({
            label: item.displayName, value: item.name, checked: false
          });
        });
      });

    this._ztService.getAllZtCode()
      .subscribe(res => {
        this.ztCodeDtoList = res;
        res.forEach(item => {
          this.ztCodeList.push({
            label: item.name, value: item.code, checked: false
          });
        });
      });
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
    this.user.roleNames = tmpRoleNames;

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

    this._userService.create(this.user)
      .finally(() => { this.saving = false; })
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.success();
      });
  }

}
