import { Component, Inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@delon/theme';
import { AppComponentBase } from '@shared/component-base';
import { AppAuthService } from '@shared/auth/app-auth.service';
// import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ChangePasswordInput, SelfUserServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'header-user',
  template: `
  <nz-dropdown nzPlacement="bottomRight">
    <div class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown>
      <nz-avatar  nzSize="small" class="mr-sm"></nz-avatar>
      
    </div>
    <div nz-menu class="width-sm">
      <div nz-menu-item (click)='showModal()'>
        <i nz-icon type="setting" class="mr-sm"></i>
        修改密码
      </div>
      <li nz-menu-divider></li>
      <div nz-menu-item (click)="logout()">
        <i nz-icon type="logout" class="mr-sm"></i>
        {{l('Logout')}}
      </div>
    </div>
  </nz-dropdown>
  <nz-modal [(nzVisible)]="isVisible" nzTitle="修改密码" (nzOnCancel)="handleCancel()" (nzOnOk)="handleOk()">
  <form nz-form>
      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="email">旧密码</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24">
          <input nz-input type="password" id="oldPassword" name="oldPassword" [(ngModel)]='passObj.oldPassword'>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="password" nzRequired>新密码</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24">
          <input nz-input type="password" id="newPassword" name="newPassword" [(ngModel)]='passObj.newPassword'>
        </nz-form-control>
      </nz-form-item>
      </form>
</nz-modal>
  `,
})
export class HeaderUserComponent extends AppComponentBase {
  isVisible = false;
  passObj: ChangePasswordInput;

  constructor(
    injector: Injector,
    private _authService: AppAuthService,
    private _userService: SelfUserServiceProxy,
  ) {
    super(injector);
    this.passObj = new ChangePasswordInput();
  }

  logout(): void {
    this._authService.logout();
  }

  showModal(): void {
    this.isVisible = true;
  };

  handleCancel() {
    this.isVisible = false;
  }

  handleOk() {
    if (!this.passObj.oldPassword) {
      this.message.warn("旧密码不能为空！");
      return;
    }
    if (!this.passObj.newPassword || this.passObj.newPassword.length < 6) {
      this.message.warn("新密码不能少于6位！");
      return;
    }
    this._userService.changePassword(this.passObj).subscribe(() => {
      this.message.info("修改成功！");
      this.isVisible = false;
    });
  }
}

