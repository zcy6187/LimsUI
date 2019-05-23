import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AbpHttpInterceptor } from '@abp/abpHttpInterceptor';

import * as ApiServiceProxies from '@shared/service-proxies/service-proxies';

@NgModule({
  providers: [
    ApiServiceProxies.RoleServiceProxy,
    ApiServiceProxies.SessionServiceProxy,
    ApiServiceProxies.TenantServiceProxy,
    ApiServiceProxies.UserServiceProxy,
    ApiServiceProxies.TokenAuthServiceProxy,
    ApiServiceProxies.AccountServiceProxy,
    ApiServiceProxies.ConfigurationServiceProxy,
    ApiServiceProxies.TenantRegistrationServiceProxy,
    ApiServiceProxies.Assay_SpecimenServiceProxy,
    ApiServiceProxies.Assay_ElementServiceProxy,
    ApiServiceProxies.Assay_UnitServiceProxy,
    ApiServiceProxies.OrgServiceProxy,
    ApiServiceProxies.Assay_TplServiceProxy,
    ApiServiceProxies.Assay_TokenServiceProxy,
    ApiServiceProxies.Assay_UserTplServiceProxy,
    ApiServiceProxies.Assay_DataSearchServiceProxy,
    ApiServiceProxies.Assay_DataInputServiceProxy,
    ApiServiceProxies.Assay_UserServiceProxy,
    ApiServiceProxies.Assay_AttendanceServiceProxy,
    ApiServiceProxies.ZtCodeServiceProxy,
    ApiServiceProxies.SelfUserServiceProxy,
    ApiServiceProxies.Assay_StatisticServiceProxy,
    ApiServiceProxies.Assay_SelfTplServiceProxy,
    ApiServiceProxies.Assay_FormulaServiceProxy,
    ApiServiceProxies.DetectServiceProxy,
    { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true },
  ],
})
export class ServiceProxyModule { }
